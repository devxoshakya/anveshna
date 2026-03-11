---
name: code-cleanup
description: 'Analyze and remove redundant code in TypeScript/React/Next.js projects. Identifies unused variables, functions, imports, dead code, duplicate code, and unused files. Runs tests to verify safety. Use for: cleaning up codebase, removing dead code, eliminating unused imports, finding duplicate code, optimizing bundle size.'
argument-hint: 'Optional: specify path or file pattern to analyze (e.g., "components/" or "**/*.tsx")'
---

# Code Cleanup - Intelligent Redundancy Removal

Systematically identifies and removes redundant code while ensuring nothing breaks through automated testing and safety checks.

## When to Use

- Clean up after refactoring or feature removal
- Reduce bundle size by removing unused code
- Eliminate unused imports, variables, or functions
- Find and remove dead code paths
- Identify duplicate code for consolidation
- Prepare codebase for production deployment

## Scope of Analysis

1. **Unused Imports** - Import statements that are never referenced
2. **Unused Variables/Functions** - Declared but never used
3. **Dead Code** - Unreachable code paths (with extra verification)
4. **Duplicate Code** - Similar/identical code blocks
5. **Unused Files** - Files not imported anywhere in the project

## Safety Principles

- **Conservative by default**: Only auto-delete code that is 100% confirmed unused
- **Ask before deletion**: Flag uncertain cases for user review
- **Test-driven**: Run existing tests after each deletion batch
- **Type-safe**: Leverage TypeScript compiler for usage analysis
- **Incremental**: Make small batches of changes, verify, then continue

## Procedure

### Phase 1: Discovery & Analysis

1. **Determine scope**
   - Use provided path/pattern or default to entire workspace
   - Identify TypeScript/TSX files to analyze
   - List test files to preserve

2. **Run static analysis**
   - Use TypeScript compiler API to find unused exports
   - Check ESLint for unused variable warnings (if configured)
   - Search for unreferenced imports across all files
   - Identify files not imported anywhere

3. **Categorize findings**
   - **Safe to delete** (100% confidence): Unused private functions, unused local variables, unused imports
   - **Review required** (uncertain): Public exports, potential side effects, ambiguous dead code
   - **Preserve** (keep): Test utilities, public APIs, config files, Next.js convention files (layout.tsx, page.tsx, etc.)

### Phase 2: Dead Code Detection (Extra Verification)

Dead code is tricky - apply multiple verification methods:

1. **Control flow analysis**
   - Identify code after `return`, `throw`, or `break` statements
   - Find unreachable `if/else` branches (literal condition checks)
   - Flag code in always-false conditions

2. **Cross-reference checks**
   - Verify no dynamic imports (`import()`) reference the code
   - Check for string-based references (e.g., `require()`, route strings)
   - Search for usage in configuration files (next.config.ts, etc.)

3. **Context validation**
   - Review surrounding code context
   - Check git history for recent changes (might indicate intentional comments/TODO)
   - Verify it's not a framework convention (React lifecycle, Next.js exports)

4. **Flag for review if ANY uncertainty exists**

### Phase 3: Duplicate Code Identification

1. **Find similar code blocks**
   - Look for repeated logic patterns (3+ lines)
   - Identify copy-pasted components or functions
   - Flag similar utility functions

2. **Suggest consolidation**
   - Don't auto-delete duplicates - they may have subtle differences
   - Present options: extract to shared utility, create abstraction, or keep separate
   - User decides on deduplication strategy

### Phase 4: Safe Auto-Cleanup

For **SAFE TO DELETE** items only:

1. **Batch deletions by type**
   - Start with unused imports (lowest risk)
   - Then unused local variables
   - Then unused private functions
   - Finally unused internal files

2. **Incremental verification**
   - After each batch:
     - Run TypeScript compilation: `npx tsc --noEmit`
     - Run linting: `npm run lint` (if configured)
     - Run tests: `npm test` or `npm run test`
   - If any check fails, revert the batch and flag for manual review

3. **Create safety checkpoint**
   - Save git status before starting cleanup
   - Suggest creating a branch if not on one already
   - Enable easy rollback if needed

### Phase 5: Review Required Items

For items flagged as **REVIEW REQUIRED**:

1. **Present findings clearly**
   - Show file path and line numbers
   - Display the code in question with context
   - Explain why it's flagged (uncertainty reason)

2. **Provide analysis**
   - Show where it's defined vs. where it might be used
   - List potential risks of removal
   - Suggest whether to keep, delete, or refactor

3. **Get user confirmation**
   - Ask explicitly: "Should I remove this?"
   - If yes, add to deletion queue
   - If no, mark as intentional and exclude from future scans

4. **Execute confirmed deletions**
   - Apply user-approved removals
   - Run full test suite
   - Report results

### Phase 6: Final Verification & Report

1. **Comprehensive test run**
   - Execute full test suite: `npm test`
   - Run build process: `npm run build`
   - Verify TypeScript compilation
   - Check for lint errors

2. **Generate cleanup report**
   - Total items removed (by category)
   - Files modified or deleted
   - Items flagged for review
   - Test results and verification status
   - Estimated bundle size impact

3. **Suggest next steps**
   - Commit changes with descriptive message
   - Address any flagged review items
   - Consider further optimization opportunities

## Next.js Specific Considerations

**Preserve these patterns** (false positives):

- `app/layout.tsx`, `app/page.tsx` - Next.js routing conventions
- `export default` in page files - Required for Next.js pages
- `export const metadata` - Next.js metadata API
- `export const dynamic/revalidate` - Next.js caching config
- Server components without obvious client usage
- API route handlers in `app/api/`

**Safe cleanup targets**:

- Unused imports in any component
- Unused helper functions not exported
- Dead code in client/server components
- Duplicate utility functions
- Unused TypeScript types/interfaces

## TypeScript/React Patterns

**Extra caution for**:

- React hooks (useEffect, useMemo, etc.) - May have side effects
- Context providers - Check for consumers in component tree
- HOCs (Higher-Order Components) - Verify wrapped component usage
- Type definitions - May be used in type-only imports

**Safe to remove**:

- Imports with unused specifiers: `import { used, unused } from 'lib'` → remove `unused`
- Unused props in components (after verifying they're not used by parent)
- Unreferenced utility functions in lib/ or utils/
- Unused constants or enums

## Error Handling

If any phase fails:

1. **Stop immediately** - Don't proceed with deletions
2. **Preserve state** - Keep analysis results for review
3. **Report the issue** - Show error messages and context
4. **Suggest manual investigation** - Provide file paths and details
5. **Enable recovery** - Offer to revert changes if already made

## Usage Examples

```
/code-cleanup
→ Analyze entire workspace

/code-cleanup components/
→ Clean up only components directory

/code-cleanup **/*.ts
→ Analyze only TypeScript files (not TSX)
```

## Output Format

Provide progress updates during execution:

- ✓ Phase completed successfully
- ⚠ Warning or review needed
- ✗ Error or failure
- → Action taken

Final report should be concise but comprehensive, highlighting impact and any required follow-up actions.
