# Manager Portal – Implementation Plan

> Source of truth for the manager portal roadmap. Update the status of each item as work progresses.
> Last updated: Oct 5, 2026

## Status Overview

| Phase | Scope | Status |
|---|---|---|
| Phase 1 | Manager assessment + basic gap analysis | 🟡 ~95% – SQL migration + E2E test pending |
| Phase 2 | Stakeholder feedback | ⬜ Not started |
| Phase 3 | Versioned, admin-editable categories | ⬜ Not started |
| Phase 4 | AI pre-fill + visual enhancements | ⬜ Not started |

---

## Phase 1 – Manager Assessment (5 days)

```
1. Database Tables (Day 1)                                   ✅
   ├─ manager_assessments table                              ✅
   ├─ rating_mappings table (4 options)                      ✅
   └─ Migration script                                       ✅ manager-portal-phase1-migration.sql

2. Manager Dashboard (Day 2)                                 ✅ /dashboard (UnifiedDashboard.tsx)
   ├─ View all associates who submitted                      ✅
   ├─ Track assessment progress                              ✅
   └─ Access individual assessments                          ✅

3. Manager Assessment Interface (Day 3)                      ✅ /manager-assess/:id (ManagerAssess.tsx)
   ├─ Category-level rating (8 categories)                   ✅
   ├─ 1-2 guiding questions per category                     ✅
   ├─ Rating options → changed to 1–5 scale (Decision B1)      ✅ code / ⬜ SQL
   └─ Save progress                                          ✅

4. Basic Gap Analysis (Day 4)                                🟡 /gap-analysis/:id (GapAnalysis.tsx)
   ├─ Calculate category averages from self-assessment       ✅ role-aware mapping (src/data/categories.ts)
   ├─ Compare self vs manager                                ✅ both on 1–5
   ├─ Show gaps (No Gap / Positive / Concern / Blind Spot)   ✅
   └─ Simple table view                                      ✅

5. Export & Testing (Day 5)                                  🟡
   ├─ Export to Excel                                        ✅
   ├─ End-to-end testing                                     ⬜
   └─ Bug fixes                                              ⬜
```

### Phase 1 Close-out Tasks
- [x] Shared 8-category constant; compute self-ratings from `roleQuestions.ts` skillCategories (not keywords) → `src/data/categories.ts`
- [x] Map all role-specific category names (Associate, UX, Senior, Lead) to the 8 manager categories
- [x] Resolve self vs manager scale mismatch → Decision B1 (1–5 manager scale)
- [x] Rename gap labels to No Gap / Positive / Concern / Blind Spot
- [x] Dashboard category chart: use the same 8 categories
- [x] Filter gap analysis + dashboard status by `assessor_role = 'manager'` (Phase 2 prep)
- [x] Remove stray files: `UnifiedDashboard.tsx.backup`, `UnifiedDashboard_UPDATED.tsx`
- [ ] Run `manager-portal-b1-rating-scale.sql` in Supabase (deletes existing manager assessments)
- [ ] End-to-end test: submit → manager assess → gap analysis → export

### Decisions (Oct 5, 2026)
1. **Gap labels** (confirmed):
   - No Gap: |self − manager| ≤ 0.5
   - Positive: manager rates higher than self
   - Concern: self rates higher than manager
   - Blind Spot: manager selected "Unable to Assess"
   - (No Self-Rating: role has no matching self-assessment category, e.g. Lead → Design Execution)
2. **Rating scale – Option B1**: managers rate each of the 8 categories on the same 1–5 scale as associates
   (Beginner / Developing / Competent / Proficient / Expert) + Unable to Assess. Category-level only – question-level (B2) rejected.
3. **Existing manager assessments** on the old 4.5/3.0/1.5 scale are deleted (test data).

---

## Phase 2 – Stakeholder Feedback (4 days)

```
1. Database Tables (Day 1)
   ├─ stakeholder_assignments table
   └─ Update manager_assessments to handle stakeholders

2. Stakeholder Assignment UI (Day 2)
   ├─ Add stakeholders to associate
   ├─ Generate unique secure links
   ├─ Copy/share links manually
   └─ Track completion status

3. Stakeholder Assessment Page (Day 3)
   ├─ Public page with token
   ├─ Email verification
   ├─ Same category-level assessment (4 options)
   └─ Submit feedback

4. Enhanced Gap Analysis (Day 4)
   ├─ Include stakeholder ratings
   ├─ Show: Self vs Manager vs Stakeholders
   ├─ Aggregate stakeholder average
   └─ Testing & bug fixes
```

Notes: `manager_assessments` already has `assessor_role` and `UNIQUE(associate_assessment_id, assessor_email)`, so multiple assessors per associate are supported.

---

## Phase 3 – Versioned Categories (3 days)

```
1. Database Tables (Day 1)
   ├─ assessment_versions table
   ├─ assessment_categories table
   ├─ assessment_questions table
   └─ Link existing assessments to v1.0

2. Admin Category Manager (Day 2)
   ├─ View current categories
   ├─ Add/edit/remove categories
   ├─ Create new version
   └─ Version history

3. Dynamic Loading & Testing (Day 3)
   ├─ Update forms to load categories from database
   ├─ Fallback to hardcoded if DB fails
   ├─ Version-aware gap analysis
   └─ Testing & bug fixes
```

---

## Phase 4 – AI Pre-Fill & Visuals (2 days)

```
1. AI Pre-Fill Logic (Day 1)
   ├─ Rule-based suggestions
   ├─ Experience-based baseline
   ├─ Flag outliers
   └─ Integration with assessment interface

2. Visual Enhancements (Day 2)
   ├─ Radar charts (self vs manager vs stakeholders)
   ├─ Bar charts (gap visualization)
   ├─ Priority action recommendations
   ├─ Enhanced export with charts
   └─ Testing & polish
```

---

## Reference

- **Manager portal:** https://career-assessment-form-five.vercel.app/dashboard?token=manager_access_2024
- **Key files:** `src/pages/UnifiedDashboard.tsx`, `src/pages/ManagerAssess.tsx`, `src/pages/GapAnalysis.tsx`, `src/data/roleQuestions.ts`
- **Migration:** `manager-portal-phase1-migration.sql`
