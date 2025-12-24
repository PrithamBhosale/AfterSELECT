/**
 * Query Result Validation Utility
 * Compares user's query result against the expected solution result
 */

export interface ValidationResult {
    isValid: boolean;
    message: string;
    details?: {
        expectedRowCount?: number;
        actualRowCount?: number;
        expectedColumns?: string[];
        actualColumns?: string[];
        mismatchedRows?: number[];
    };
}

/**
 * Normalize a value for comparison (handles different types, nulls, etc.)
 */
function normalizeValue(value: unknown): string {
    if (value === null || value === undefined) {
        return 'NULL';
    }
    if (typeof value === 'number') {
        // Round to 2 decimal places for floats
        return Number.isInteger(value) ? String(value) : value.toFixed(2);
    }
    return String(value).trim().toLowerCase();
}

/**
 * Compare two rows of data
 */
function rowsMatch(row1: Record<string, unknown>, row2: Record<string, unknown>, columns: string[]): boolean {
    for (const col of columns) {
        const val1 = normalizeValue(row1[col]);
        const val2 = normalizeValue(row2[col]);
        if (val1 !== val2) {
            return false;
        }
    }
    return true;
}

/**
 * Check if two arrays of data contain the same rows (order-independent)
 */
function dataMatchesUnordered(
    expected: Record<string, unknown>[],
    actual: Record<string, unknown>[],
    columns: string[]
): { matches: boolean; mismatchedRows: number[] } {
    const mismatchedRows: number[] = [];

    // Create a copy of expected to track which rows have been matched
    const unmatchedExpected = [...expected];

    for (let i = 0; i < actual.length; i++) {
        const actualRow = actual[i];
        let foundMatch = false;

        for (let j = 0; j < unmatchedExpected.length; j++) {
            if (rowsMatch(actualRow, unmatchedExpected[j], columns)) {
                // Remove matched row from unmatched list
                unmatchedExpected.splice(j, 1);
                foundMatch = true;
                break;
            }
        }

        if (!foundMatch) {
            mismatchedRows.push(i);
        }
    }

    return {
        matches: mismatchedRows.length === 0 && unmatchedExpected.length === 0,
        mismatchedRows
    };
}

/**
 * Validate user's query result against expected result
 */
export function validateQueryResult(
    userResult: Record<string, unknown>[] | null,
    expectedResult: Record<string, unknown>[] | null,
    options: {
        checkOrder?: boolean;  // Whether row order matters
        strictColumns?: boolean;  // Whether column set must match exactly
    } = {}
): ValidationResult {
    const { checkOrder = false, strictColumns = true } = options;

    // Handle null/empty cases
    if (!expectedResult && !userResult) {
        return { isValid: true, message: 'Query executed successfully.' };
    }

    if (!expectedResult || expectedResult.length === 0) {
        if (!userResult || userResult.length === 0) {
            return { isValid: true, message: 'Query executed successfully. No rows expected.' };
        }
        return {
            isValid: false,
            message: `Expected no rows, but your query returned ${userResult.length} row(s).`,
            details: { expectedRowCount: 0, actualRowCount: userResult.length }
        };
    }

    if (!userResult || userResult.length === 0) {
        return {
            isValid: false,
            message: `Expected ${expectedResult.length} row(s), but your query returned no rows.`,
            details: { expectedRowCount: expectedResult.length, actualRowCount: 0 }
        };
    }

    // Get columns from both results
    const expectedColumns = Object.keys(expectedResult[0]).map(c => c.toLowerCase());
    const actualColumns = Object.keys(userResult[0]).map(c => c.toLowerCase());

    // Validate columns
    if (strictColumns) {
        const missingColumns = expectedColumns.filter(c => !actualColumns.includes(c));
        const extraColumns = actualColumns.filter(c => !expectedColumns.includes(c));

        if (missingColumns.length > 0 || extraColumns.length > 0 || expectedColumns.length !== actualColumns.length) {
            let message = 'Column mismatch!\n\n';
            message += `Expected columns: ${expectedColumns.join(', ')}\n`;
            message += `Your columns: ${actualColumns.join(', ')}\n\n`;

            if (missingColumns.length > 0) {
                message += `Missing: ${missingColumns.join(', ')}\n`;
            }
            if (extraColumns.length > 0) {
                message += `Extra: ${extraColumns.join(', ')}\n`;
            }

            if (actualColumns.length > expectedColumns.length) {
                message += '\nHint: Don\'t use SELECT * - specify only the required columns.';
            }

            return {
                isValid: false,
                message,
                details: { expectedColumns, actualColumns }
            };
        }
    }

    // Validate row count
    if (userResult.length !== expectedResult.length) {
        return {
            isValid: false,
            message: `Row count mismatch! Expected ${expectedResult.length} row(s), but got ${userResult.length} row(s).\n\nThis might mean your WHERE clause or JOIN conditions are different from what's expected.`,
            details: { expectedRowCount: expectedResult.length, actualRowCount: userResult.length }
        };
    }

    // Validate data content
    // Normalize column names for comparison
    const normalizedExpected = expectedResult.map(row => {
        const normalized: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(row)) {
            normalized[key.toLowerCase()] = value;
        }
        return normalized;
    });

    const normalizedActual = userResult.map(row => {
        const normalized: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(row)) {
            normalized[key.toLowerCase()] = value;
        }
        return normalized;
    });

    if (checkOrder) {
        // Check row by row
        for (let i = 0; i < normalizedExpected.length; i++) {
            if (!rowsMatch(normalizedActual[i], normalizedExpected[i], expectedColumns)) {
                return {
                    isValid: false,
                    message: `Data mismatch at row ${i + 1}. Your query returned different values than expected.\n\nCheck your query logic, filters, and calculations.`,
                    details: { mismatchedRows: [i] }
                };
            }
        }
    } else {
        // Order-independent comparison
        const { matches, mismatchedRows } = dataMatchesUnordered(normalizedExpected, normalizedActual, expectedColumns);
        if (!matches) {
            return {
                isValid: false,
                message: `Data mismatch! Your query returned different values than expected.\n\nWhile the row count matches, the actual data values differ. Check your filters, conditions, and calculations.`,
                details: { mismatchedRows }
            };
        }
    }

    return { isValid: true, message: 'Query executed successfully.' };
}

/**
 * Check if a query is a SELECT query (vs DDL/DML)
 */
export function isSelectQuery(query: string): boolean {
    const trimmed = query.trim().toUpperCase();
    return trimmed.startsWith('SELECT') || trimmed.startsWith('WITH');
}

/**
 * Check if query results data validation should be skipped
 * (for DDL, DML, or queries that modify state)
 */
export function shouldSkipDataValidation(query: string): boolean {
    const upperQuery = query.trim().toUpperCase();
    const skipPatterns = [
        /^CREATE\s/,
        /^ALTER\s/,
        /^DROP\s/,
        /^INSERT\s/,
        /^UPDATE\s/,
        /^DELETE\s/,
        /^TRUNCATE\s/,
        /^EXEC\s/,
        /^EXECUTE\s/,
    ];

    return skipPatterns.some(pattern => pattern.test(upperQuery));
}
