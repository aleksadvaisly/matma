"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.parseExerciseId = parseExerciseId;
exports.compareExerciseIds = compareExerciseIds;
exports.getExercisesBySection = getExercisesBySection;
exports.getSectionInfo = getSectionInfo;
exports.getSectionHints = getSectionHints;
exports.getExerciseVariants = getExerciseVariants;
var better_sqlite3_1 = require("better-sqlite3");
var path_1 = require("path");
var fraction_1 = require("./fraction");
var db = new better_sqlite3_1.default(path_1.default.join(process.cwd(), 'matma.db'));
exports.db = db;
// Enable WAL mode for better concurrency and immediate consistency
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = 1000');
db.pragma('temp_store = memory');
/**
 * Parse exercise ID into sortable numeric components
 * Example: "7-1-2" → [7, 1, 2]
 * Example: "7-1-2-a" → [7, 1, 2, 'a']
 */
function parseExerciseId(id) {
    return id.split('-').map(function (part) {
        var num = parseInt(part);
        return isNaN(num) ? part : num;
    });
}
/**
 * Compare two exercise IDs for sorting
 * Returns negative if a < b, positive if a > b, 0 if equal
 */
function compareExerciseIds(idA, idB) {
    var _a, _b;
    var partsA = parseExerciseId(idA);
    var partsB = parseExerciseId(idB);
    for (var i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        var partA = (_a = partsA[i]) !== null && _a !== void 0 ? _a : 0;
        var partB = (_b = partsB[i]) !== null && _b !== void 0 ? _b : 0;
        // Both are numbers
        if (typeof partA === 'number' && typeof partB === 'number') {
            if (partA !== partB)
                return partA - partB;
        }
        // Both are strings
        else if (typeof partA === 'string' && typeof partB === 'string') {
            var comp = partA.localeCompare(partB);
            if (comp !== 0)
                return comp;
        }
        // Mixed types - numbers come before strings
        else if (typeof partA === 'number') {
            return -1;
        }
        else {
            return 1;
        }
    }
    return 0;
}
/**
 * Calculate optimal number line range based on the correct answer
 * Prevents the recurring issue of manually configured incorrect ranges
 */
function calculateOptimalRange(correctAnswer) {
    try {
        var answerFraction = fraction_1.Fraction.parse(correctAnswer);
        if (!answerFraction) {
            console.warn("Could not parse answer \"".concat(correctAnswer, "\" as fraction, using default range"));
            return { min: 0, max: 10 };
        }
        var answerDecimal = answerFraction.toDecimal();
        // Smart range calculation based on answer value
        if (answerDecimal < 0) {
            // For negative answers, ensure range includes 0 and extends beyond answer
            var min = Math.floor(answerDecimal - 1);
            var max = Math.max(2, Math.ceil(Math.abs(answerDecimal)) + 1);
            return { min: min, max: max };
        }
        else if (answerDecimal < 1) {
            // For fractional answers less than 1, use 0 to 2 or 3
            return { min: 0, max: answerDecimal > 0.5 ? 3 : 2 };
        }
        else {
            // For positive answers >= 1
            var answerInt = Math.floor(answerDecimal);
            var padding = answerInt <= 3 ? 1 : 2; // Smaller padding for small numbers
            return {
                min: Math.max(0, answerInt - padding),
                max: answerInt + padding + 1
            };
        }
    }
    catch (error) {
        console.error("Error calculating range for answer \"".concat(correctAnswer, "\":"), error);
        return { min: 0, max: 10 };
    }
}
function getExercisesBySection(sectionId, specificExerciseId) {
    var _a;
    // Check if section has variants (exercise_base_id is not null)
    var hasVariants = db.prepare("\n    SELECT COUNT(*) as count\n    FROM exercises \n    WHERE section_id = ? AND exercise_base_id IS NOT NULL\n  ").get(sectionId);
    var exercises = [];
    if (hasVariants.count > 0) {
        // Use variant system for sections that have it
        var baseExercises = db.prepare("\n      SELECT DISTINCT exercise_base_id\n      FROM exercises\n      WHERE section_id = ? AND exercise_base_id IS NOT NULL\n      GROUP BY exercise_base_id\n    ").all(sectionId);
        // Sort by parsed exercise IDs instead of order_index
        baseExercises.sort(function (a, b) { return compareExerciseIds(a.exercise_base_id, b.exercise_base_id); });
        // For each base exercise, select appropriate variant
        for (var _i = 0, baseExercises_1 = baseExercises; _i < baseExercises_1.length; _i++) {
            var base = baseExercises_1[_i];
            var variant = void 0;
            // If a specific exercise ID is requested, try to use its variant
            if (specificExerciseId && specificExerciseId.startsWith(base.exercise_base_id)) {
                // Extract variant letter from specific ID
                var requestedVariant = (_a = specificExerciseId.match(/-([a-z])$/)) === null || _a === void 0 ? void 0 : _a[1];
                if (requestedVariant) {
                    variant = db.prepare("\n            SELECT \n              e.*,\n              e.layout_type,\n              it.type_name as input_type\n            FROM exercises e\n            JOIN input_types it ON e.input_type_id = it.id\n            WHERE e.exercise_base_id = ? AND e.variant_letter = ?\n          ").get(base.exercise_base_id, requestedVariant);
                }
            }
            // Fallback to first variant if specific not found
            if (!variant) {
                variant = db.prepare("\n          SELECT \n            e.*,\n            e.layout_type,\n            it.type_name as input_type\n          FROM exercises e\n          JOIN input_types it ON e.input_type_id = it.id\n          WHERE e.exercise_base_id = ?\n          ORDER BY e.variant_letter\n          LIMIT 1\n        ").get(base.exercise_base_id);
            }
            if (variant) {
                exercises.push(variant);
            }
        }
    }
    else {
        // Fallback to old system for sections without variants
        exercises = db.prepare("\n      SELECT \n        e.*,\n        e.layout_type,\n        it.type_name as input_type\n      FROM exercises e\n      JOIN input_types it ON e.input_type_id = it.id\n      WHERE e.section_id = ?\n    ").all(sectionId);
        // Sort by parsed exercise IDs instead of order_index
        exercises.sort(function (a, b) { return compareExerciseIds(a.id, b.id); });
    }
    // Get options for each exercise
    for (var _b = 0, exercises_1 = exercises; _b < exercises_1.length; _b++) {
        var exercise = exercises_1[_b];
        if (exercise.input_type === 'choices') {
            var options = db.prepare("\n        SELECT option_text, option_value, order_index\n        FROM exercise_options\n        WHERE exercise_id = ?\n        ORDER BY order_index\n      ").all(exercise.id);
            exercise.options = options;
        }
        // Get visual config - first check exercise-specific, then section-level
        if (exercise.input_type === 'number-line' || exercise.input_type === 'text' || exercise.input_type === 'sequence-builder') {
            // First try to get exercise-specific config from visual_configs table
            var exerciseConfig = db.prepare("\n        SELECT config_json\n        FROM visual_configs\n        WHERE exercise_id = ?\n      ").get(exercise.id);
            if (exerciseConfig) {
                try {
                    exercise.visualConfig = JSON.parse(exerciseConfig.config_json);
                    // Keep visual config as-is from database
                    // The display layer (number-line.tsx) will handle not showing edge labels
                }
                catch (error) {
                    console.error('Failed to parse exercise visual config:', error);
                }
            }
            // If no exercise-specific config and it's number-line, try section_components
            if (!exercise.visualConfig && exercise.input_type === 'number-line') {
                var config = db.prepare("\n          SELECT processing_config\n          FROM section_components\n          WHERE section_id = ?\n        ").get(exercise.section_id);
                if (config) {
                    try {
                        var parsedConfig = JSON.parse(config.processing_config);
                        exercise.visualConfig = parsedConfig.numberLineConfig || { enableAllClicks: true };
                    }
                    catch (error) {
                        // Default config if parsing fails
                        exercise.visualConfig = { enableAllClicks: true };
                    }
                }
                else {
                    // Default config if no section config exists - use smart range calculation
                    var optimalRange = calculateOptimalRange(exercise.correct_answer);
                    exercise.visualConfig = __assign({ enableAllClicks: true }, optimalRange);
                }
            }
            // Default configs if nothing found
            if (!exercise.visualConfig) {
                if (exercise.input_type === 'number-line') {
                    var optimalRange = calculateOptimalRange(exercise.correct_answer);
                    exercise.visualConfig = __assign({ enableAllClicks: true }, optimalRange);
                }
                else if (exercise.input_type === 'text') {
                    exercise.visualConfig = {};
                }
                else if (exercise.input_type === 'sequence-builder') {
                    exercise.visualConfig = {};
                }
            }
        }
    }
    return exercises;
}
function getSectionInfo(sectionId) {
    var section = db.prepare("\n    SELECT title, description \n    FROM sections \n    WHERE id = ?\n  ").get(sectionId);
    return section;
}
function getSectionHints(sectionId) {
    var hints = db.prepare("\n    SELECT hint_text\n    FROM section_hints\n    WHERE section_id = ?\n    ORDER BY order_index\n  ").all(sectionId);
    return hints.map(function (h) { return h.hint_text; });
}
function getExerciseVariants(exerciseBaseId) {
    var variants = db.prepare("\n    SELECT DISTINCT variant_letter\n    FROM exercises\n    WHERE exercise_base_id = ?\n    ORDER BY variant_letter\n  ").all(exerciseBaseId);
    return variants.map(function (v) { return v.variant_letter; });
}
