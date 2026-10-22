# Generated code reference

Snapshot: `5c6cc757828b5060e3ab63e23915d2501b584370`. Source inspection, not runtime verification.

## API route index

Declared Express feature routes, including development-only maintenance endpoints. Inline permission calls and preceding router.use calls are listed; guards inside callbacks/controllers/services still apply. Read the linked route plus service before changing authorization. This is a source index, not a generated OpenAPI contract.

| Method | Route | Route guards | Validation schema | Source |
|---|---|---|---|---|
| POST | `/api/auth/login` | Check handler / public route | loginSchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/auth/auth.routes.ts#L9) |
| GET | `/api/auth/me` | Check handler / public route | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/auth/auth.routes.ts#L10) |
| POST | `/api/auth/change-password` | Check handler / public route | changePasswordSchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/auth/auth.routes.ts#L13) |
| POST | `/api/auth/setup-password` | Check handler / public route | setupPasswordSchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/auth/auth.routes.ts#L14) |
| POST | `/api/employees/documents/upload` | requirePermission(&#x27;employees&#x27;, &#x27;edit&#x27;) | uploadDocumentSchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/document.routes.ts#L12) |
| GET | `/api/employees/documents/:employeeId` | requirePermission(&#x27;employees&#x27;, &#x27;view&#x27;) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/document.routes.ts#L13) |
| GET | `/api/employees/documents/:id/download` | requirePermission(&#x27;employees&#x27;, &#x27;view&#x27;) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/document.routes.ts#L14) |
| DELETE | `/api/employees/documents/:id` | requirePermission(&#x27;employees&#x27;, &#x27;edit&#x27;) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/document.routes.ts#L15) |
| PUT | `/api/employees/documents/:id/verify` | requirePermission(&#x27;employees&#x27;, &#x27;approve&#x27;) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/document.routes.ts#L16) |
| GET | `/api/employees/public-card/:token` | Check handler / public route | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/employee.routes.ts#L13) |
| GET | `/api/employees/dashboard-stats` | requirePermission(&#x27;dashboard&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/employee.routes.ts#L17) |
| GET | `/api/employees` | requirePermission(&#x27;employees&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/employee.routes.ts#L20) |
| GET | `/api/employees/:id/public-card-token` | requirePermission(&#x27;employees&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/employee.routes.ts#L21) |
| GET | `/api/employees/:id` | requirePermission(&#x27;employees&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/employee.routes.ts#L24) |
| POST | `/api/employees` | requirePermission(&#x27;employees&#x27;, &#x27;add&#x27;); router.use(authenticate) | createEmployeeSchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/employee.routes.ts#L25) |
| PUT | `/api/employees/:id` | requirePermission(&#x27;employees&#x27;, &#x27;edit&#x27;); router.use(authenticate) | updateEmployeeSchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/employee.routes.ts#L28) |
| DELETE | `/api/employees/:id` | requirePermission(&#x27;employees&#x27;, &#x27;delete&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/employee.routes.ts#L31) |
| POST | `/api/employees/:id/photo` | requirePermission(&#x27;employees&#x27;, &#x27;edit&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/employee.routes.ts#L35) |
| POST | `/api/employees/fix-users` | authorize(&#x27;ADMIN&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/employee.routes.ts#L66) |
| POST | `/api/employees/reactivate-and-fix` | authorize(&#x27;ADMIN&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/employee.routes.ts#L91) |
| POST | `/api/employees/clear-history` | authorize(&#x27;ADMIN&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/employee.routes.ts#L125) |
| GET | `/api/departments` | requirePermission(&#x27;departments&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/departments/department.routes.ts#L11) |
| GET | `/api/departments/:id` | requirePermission(&#x27;departments&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/departments/department.routes.ts#L12) |
| POST | `/api/departments` | requirePermission(&#x27;departments&#x27;, &#x27;add&#x27;); router.use(authenticate) | createDepartmentSchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/departments/department.routes.ts#L13) |
| PUT | `/api/departments/:id` | requirePermission(&#x27;departments&#x27;, &#x27;edit&#x27;); router.use(authenticate) | updateDepartmentSchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/departments/department.routes.ts#L14) |
| DELETE | `/api/departments/:id` | requirePermission(&#x27;departments&#x27;, &#x27;delete&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/departments/department.routes.ts#L15) |
| POST | `/api/travel` | requirePermission(&#x27;travel&#x27;, &#x27;add&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/travel/travel.routes.ts#L11) |
| GET | `/api/travel` | requirePermission(&#x27;travel&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/travel/travel.routes.ts#L12) |
| GET | `/api/travel/:id` | requirePermission(&#x27;travel&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/travel/travel.routes.ts#L13) |
| PUT | `/api/travel/:id/approve` | requirePermission(&#x27;travel&#x27;, &#x27;approve&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/travel/travel.routes.ts#L14) |
| PUT | `/api/travel/:id/settle` | requirePermission(&#x27;travel&#x27;, &#x27;edit&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/travel/travel.routes.ts#L15) |
| PUT | `/api/travel/:id/expenses` | requirePermission(&#x27;travel&#x27;, &#x27;add&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/travel/travel.routes.ts#L17) |
| GET | `/api/office-expenses` | requirePermission(&#x27;expenses&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/expenses/expense.routes.ts#L12) |
| POST | `/api/office-expenses` | requirePermission(&#x27;expenses&#x27;, &#x27;add&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/expenses/expense.routes.ts#L13) |
| PATCH | `/api/office-expenses/:id/status` | requirePermission(&#x27;expenses&#x27;, &#x27;approve&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/expenses/expense.routes.ts#L14) |
| GET | `/api/upload/files/:module/:filename` | requirePermission(module as ModuleKey, &#x27;view&#x27;) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/upload/upload.routes.ts#L11) |
| POST | `/api/upload` | requirePermission(module, action) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/upload/upload.routes.ts#L49) |
| POST | `/api/assets` | requirePermission(&#x27;assets&#x27;, &#x27;add&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/assets/asset.routes.ts#L11) |
| GET | `/api/assets` | requirePermission(&#x27;assets&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/assets/asset.routes.ts#L12) |
| GET | `/api/assets/:id` | requirePermission(&#x27;assets&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/assets/asset.routes.ts#L13) |
| PUT | `/api/assets/:id` | requirePermission(&#x27;assets&#x27;, &#x27;edit&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/assets/asset.routes.ts#L14) |
| PUT | `/api/assets/:id/assign` | requirePermission(&#x27;assets&#x27;, &#x27;edit&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/assets/asset.routes.ts#L15) |
| PUT | `/api/assets/:id/return` | requirePermission(&#x27;assets&#x27;, role === &#x27;ADMIN&#x27; || role === &#x27;HR&#x27; ? &#x27;edit&#x27; : &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/assets/asset.routes.ts#L16) |
| PUT | `/api/assets/:id/damage` | requirePermission(&#x27;assets&#x27;, &#x27;edit&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/assets/asset.routes.ts#L20) |
| PUT | `/api/assets/:id/lost` | requirePermission(&#x27;assets&#x27;, &#x27;edit&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/assets/asset.routes.ts#L21) |
| POST | `/api/recruitment/requisitions` | requirePermission(&quot;recruitment&quot;, &quot;add&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L59) |
| GET | `/api/recruitment/requisitions` | requirePermission(&quot;recruitment&quot;, &quot;view&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L65) |
| PUT | `/api/recruitment/requisitions/:id` | requirePermission(&quot;recruitment&quot;, &quot;edit&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L70) |
| PUT | `/api/recruitment/requisitions/:id/status` | requirePermission(&quot;recruitment&quot;, &quot;edit&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L76) |
| GET | `/api/recruitment/pipeline` | requirePermission(&quot;recruitment&quot;, &quot;view&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L84) |
| PUT | `/api/recruitment/candidates/:id/stage` | requirePermission(&quot;recruitment&quot;, &quot;edit&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L85) |
| GET | `/api/recruitment/interviews` | requirePermission(&quot;recruitment&quot;, &quot;view&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L86) |
| GET | `/api/recruitment/candidates` | requirePermission(&quot;recruitment&quot;, &quot;view&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L91) |
| POST | `/api/recruitment/candidates/:id/interviews` | requirePermission(&quot;recruitment&quot;, &quot;add&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L96) |
| PUT | `/api/recruitment/interviews/:interviewId/schedule` | requirePermission(&quot;recruitment&quot;, &quot;edit&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L102) |
| PUT | `/api/recruitment/interviews/:interviewId/status` | requirePermission(&quot;recruitment&quot;, &quot;edit&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L108) |
| PUT | `/api/recruitment/interviews/:interviewId/feedback` | requirePermission(&quot;recruitment&quot;, &quot;edit&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L114) |
| POST | `/api/recruitment/candidates` | requirePermission(&quot;recruitment&quot;, &quot;add&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L122) |
| GET | `/api/recruitment/requisitions/:reqId/candidates` | requirePermission(&quot;recruitment&quot;, &quot;view&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L128) |
| PUT | `/api/recruitment/candidates/:id/interview` | requirePermission(&quot;recruitment&quot;, &quot;edit&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L133) |
| PUT | `/api/recruitment/candidates/:id/offer` | requirePermission(&quot;recruitment&quot;, &quot;edit&quot;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.routes.ts#L139) |
| GET | `/api/performance/my-reviews` | requirePermission(&#x27;performance&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/performance/performance.routes.ts#L18) |
| POST | `/api/performance` | requirePermission(&#x27;performance&#x27;, &#x27;add&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/performance/performance.routes.ts#L19) |
| PUT | `/api/performance/:id` | requirePermission(&#x27;performance&#x27;, &#x27;edit&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/performance/performance.routes.ts#L20) |
| GET | `/api/performance` | requireStaffView(&#x27;performance&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/performance/performance.routes.ts#L21) |
| PUT | `/api/performance/:id/self-appraisal` | requirePermission(&#x27;performance&#x27;, &#x27;edit&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/performance/performance.routes.ts#L23) |
| PUT | `/api/performance/:id/manager-appraisal` | requirePermission(&#x27;performance&#x27;, &#x27;edit&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/performance/performance.routes.ts#L24) |
| PUT | `/api/performance/:id/hr-appraisal` | requirePermission(&#x27;performance&#x27;, &#x27;edit&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/performance/performance.routes.ts#L25) |
| PUT | `/api/performance/:id/final-approval` | requirePermission(&#x27;performance&#x27;, &#x27;approve&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/performance/performance.routes.ts#L26) |
| GET | `/api/training/my-trainings` | requirePermission(&#x27;training&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/training/training.routes.ts#L17) |
| GET | `/api/training/dashboard` | requirePermission(&#x27;training&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/training/training.routes.ts#L18) |
| GET | `/api/training` | requireStaffView(&#x27;training&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/training/training.routes.ts#L19) |
| POST | `/api/training` | requirePermission(&#x27;training&#x27;, &#x27;add&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/training/training.routes.ts#L20) |
| PUT | `/api/training/:id` | requirePermission(&#x27;training&#x27;, &#x27;edit&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/training/training.routes.ts#L21) |
| POST | `/api/training/:id/participants` | requirePermission(&#x27;training&#x27;, &#x27;edit&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/training/training.routes.ts#L24) |
| DELETE | `/api/training/:id/participants/:employeeId` | requirePermission(&#x27;training&#x27;, &#x27;edit&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/training/training.routes.ts#L25) |
| PUT | `/api/training/:id/participants/:employeeId/feedback` | requirePermission(&#x27;training&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/training/training.routes.ts#L28) |
| PUT | `/api/training/:id/participants/:employeeId/assessment` | requirePermission(&#x27;training&#x27;, &#x27;edit&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/training/training.routes.ts#L29) |
| POST | `/api/requests` | requirePermission(&#x27;requests&#x27;, &#x27;add&#x27;); router.use(authenticate) | createRequestSchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/requests/request.routes.ts#L11) |
| GET | `/api/requests/staff` | requireStaffView(&#x27;requests&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/requests/request.routes.ts#L12) |
| GET | `/api/requests/my-requests` | requirePermission(&#x27;requests&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/requests/request.routes.ts#L13) |
| GET | `/api/requests` | requireStaffView(&#x27;requests&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/requests/request.routes.ts#L14) |
| PUT | `/api/requests/:id/assign` | requirePermission(&#x27;requests&#x27;, &#x27;edit&#x27;); router.use(authenticate) | assignRequestSchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/requests/request.routes.ts#L15) |
| PUT | `/api/requests/:id/status` | requirePermission(&#x27;requests&#x27;, &#x27;approve&#x27;); router.use(authenticate) | updateRequestStatusSchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/requests/request.routes.ts#L16) |
| GET | `/api/policies` | requirePermission(&#x27;policies&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/policies/policy.routes.ts#L11) |
| GET | `/api/policies/my-acknowledgements` | requirePermission(&#x27;policies&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/policies/policy.routes.ts#L12) |
| POST | `/api/policies/:id/acknowledge` | requirePermission(&#x27;policies&#x27;, &#x27;view&#x27;); router.use(authenticate) | acknowledgePolicySchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/policies/policy.routes.ts#L13) |
| POST | `/api/policies` | requirePermission(&#x27;policies&#x27;, &#x27;add&#x27;); router.use(authenticate) | createPolicySchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/policies/policy.routes.ts#L14) |
| PUT | `/api/policies/:id` | requirePermission(&#x27;policies&#x27;, &#x27;edit&#x27;); router.use(authenticate) | updatePolicySchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/policies/policy.routes.ts#L15) |
| DELETE | `/api/policies/:id` | requirePermission(&#x27;policies&#x27;, &#x27;delete&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/policies/policy.routes.ts#L16) |
| GET | `/api/policies/:id/acknowledgements` | requirePermission(&#x27;policies&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/policies/policy.routes.ts#L17) |
| GET | `/api/notifications` | router.use(authenticate); router.use(requirePermission(&#x27;notifications&#x27;, &#x27;view&#x27;)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/notifications/notification.routes.ts#L10) |
| GET | `/api/notifications/unread-count` | router.use(authenticate); router.use(requirePermission(&#x27;notifications&#x27;, &#x27;view&#x27;)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/notifications/notification.routes.ts#L11) |
| PATCH | `/api/notifications/mark-all-read` | router.use(authenticate); router.use(requirePermission(&#x27;notifications&#x27;, &#x27;view&#x27;)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/notifications/notification.routes.ts#L12) |
| DELETE | `/api/notifications/read/clear` | requirePermission(&#x27;notifications&#x27;, &#x27;delete&#x27;); router.use(authenticate); router.use(requirePermission(&#x27;notifications&#x27;, &#x27;view&#x27;)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/notifications/notification.routes.ts#L13) |
| PATCH | `/api/notifications/:id/read` | router.use(authenticate); router.use(requirePermission(&#x27;notifications&#x27;, &#x27;view&#x27;)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/notifications/notification.routes.ts#L14) |
| DELETE | `/api/notifications/:id` | requirePermission(&#x27;notifications&#x27;, &#x27;delete&#x27;); router.use(authenticate); router.use(requirePermission(&#x27;notifications&#x27;, &#x27;view&#x27;)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/notifications/notification.routes.ts#L15) |
| GET | `/api/audit/stats` | router.use(authenticate); router.use(requirePermission(&#x27;audit&#x27;, &#x27;view&#x27;)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/audit/audit.routes.ts#L10) |
| GET | `/api/audit` | router.use(authenticate); router.use(requirePermission(&#x27;audit&#x27;, &#x27;view&#x27;)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/audit/audit.routes.ts#L11) |
| GET | `/api/audit/:module` | router.use(authenticate); router.use(requirePermission(&#x27;audit&#x27;, &#x27;view&#x27;)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/audit/audit.routes.ts#L12) |
| GET | `/api/permissions/my` | router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/permissions/permission.routes.ts#L11) |
| GET | `/api/permissions` | requirePermission(&#x27;roles&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/permissions/permission.routes.ts#L12) |
| PATCH | `/api/permissions` | requirePermission(&#x27;roles&#x27;, &#x27;edit&#x27;); router.use(authenticate) | updatePermissionSchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/permissions/permission.routes.ts#L13) |
| GET | `/api/login-history` | router.use(authenticate); router.use(requirePermission(&#x27;loginHistory&#x27;, &#x27;view&#x27;)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/loginHistory/loginHistory.routes.ts#L10) |
| GET | `/api/dashboard/stats` | requirePermission(&#x27;dashboard&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/dashboard/dashboard.routes.ts#L9) |
| GET | `/api/dashboard/attrition` | requirePermission(&#x27;attrition&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/dashboard/dashboard.routes.ts#L10) |
| GET | `/api/dashboard/reports/:type` | requirePermission(&#x27;dashboard&#x27;, &#x27;export&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/dashboard/dashboard.routes.ts#L11) |
| GET | `/api/users` | requirePermission(&#x27;roles&#x27;, &#x27;view&#x27;); router.use(authenticate); router.use(authorize(Role.ADMIN, Role.HR, Role.MANAGER)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/users/user.routes.ts#L11) |
| POST | `/api/users` | requirePermission(&#x27;roles&#x27;, &#x27;add&#x27;); router.use(authenticate); router.use(authorize(Role.ADMIN, Role.HR, Role.MANAGER)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/users/user.routes.ts#L12) |
| GET | `/api/users/:id` | requirePermission(&#x27;roles&#x27;, &#x27;view&#x27;); router.use(authenticate); router.use(authorize(Role.ADMIN, Role.HR, Role.MANAGER)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/users/user.routes.ts#L13) |
| PATCH | `/api/users/:id/role` | requirePermission(&#x27;roles&#x27;, &#x27;edit&#x27;); router.use(authenticate); router.use(authorize(Role.ADMIN, Role.HR, Role.MANAGER)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/users/user.routes.ts#L14) |
| PATCH | `/api/users/:id/status` | requirePermission(&#x27;roles&#x27;, &#x27;edit&#x27;); router.use(authenticate); router.use(authorize(Role.ADMIN, Role.HR, Role.MANAGER)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/users/user.routes.ts#L15) |
| POST | `/api/users/:id/reset-password` | requirePermission(&#x27;roles&#x27;, &#x27;edit&#x27;); router.use(authenticate); router.use(authorize(Role.ADMIN, Role.HR, Role.MANAGER)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/users/user.routes.ts#L16) |
| DELETE | `/api/users/:id` | requirePermission(&#x27;roles&#x27;, &#x27;delete&#x27;); router.use(authenticate); router.use(authorize(Role.ADMIN, Role.HR, Role.MANAGER)) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/users/user.routes.ts#L17) |
| POST | `/api/leaves/apply` | requirePermission(&#x27;leave&#x27;, &#x27;add&#x27;); router.use(authenticate) | applyLeaveSchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/leave/leave.routes.ts#L12) |
| GET | `/api/leaves/my-leaves` | requirePermission(&#x27;leave&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/leave/leave.routes.ts#L13) |
| GET | `/api/leaves/balances` | requirePermission(&#x27;leave&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/leave/leave.routes.ts#L14) |
| PATCH | `/api/leaves/:id/cancel` | requirePermission(&#x27;leave&#x27;, &#x27;edit&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/leave/leave.routes.ts#L15) |
| GET | `/api/leaves/all` | authorize(&#x27;ADMIN&#x27;, &#x27;HR&#x27;, &#x27;MANAGER&#x27;, &#x27;EMPLOYEE&#x27;); requirePermission(&#x27;leave&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/leave/leave.routes.ts#L18) |
| PATCH | `/api/leaves/:id/status` | authorize(&#x27;ADMIN&#x27;, &#x27;HR&#x27;, &#x27;MANAGER&#x27;); requirePermission(&#x27;leave&#x27;, &#x27;approve&#x27;); router.use(authenticate) | updateLeaveStatusSchema | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/leave/leave.routes.ts#L19) |
| GET | `/api/leaves/balances/:employeeId` | authorize(&#x27;ADMIN&#x27;, &#x27;HR&#x27;, &#x27;MANAGER&#x27;); requirePermission(&#x27;leave&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/leave/leave.routes.ts#L20) |
| GET | `/api/leaves/dashboard-stats` | authorize(&#x27;ADMIN&#x27;, &#x27;HR&#x27;, &#x27;MANAGER&#x27;); requirePermission(&#x27;leave&#x27;, &#x27;view&#x27;); router.use(authenticate) | Handler-specific | [source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/leave/leave.routes.ts#L23) |

Health and public image routes are mounted directly in server/src/app.ts and are described in the handbook.

## Prisma data dictionary

Exact model fields, database mappings, relations, defaults, indexes, and uniqueness constraints follow. A model in the schema does not prove a corresponding UI/API workflow exists.

### User

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L280)

```prisma
model User {
id         String   @id @default(cuid())
  email      String   @unique
  password   String
  role       Role     @default(EMPLOYEE)
  isActive   Boolean  @default(true)
  employeeId String?  @unique
  employee   Employee? @relation(fields: [employeeId], references: [id])
  deletedAt  DateTime?

  // New fields from requirements
  failedLoginAttempts   Int       @default(0)
  passwordLastChangedAt DateTime?
  twoFactorEnabled      Boolean   @default(false)
  sessionTimeoutMinutes Int       @default(30)

  // New relations
  loginHistory          LoginHistory[] @relation("UserLoginHistory")
  auditLogs             AuditLog[]
  uploadedDocuments     EmployeeDocument[] @relation("DocumentUploader")
  verifiedTravelRequests TravelRequest[]   @relation("TravelVerifier")
  uploadedPolicies      Policy[]           @relation("PolicyUploader")
  assignedRequests      EmployeeRequest[]  @relation("RequestAssignee")
  createdModulePermissions ModulePermission[] @relation("PermissionCreator")
  deactivatedAt         DateTime?
  tokenVersion          Int       @default(0)

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@map("users")
}
```

### Employee

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L313)

```prisma
model Employee {
id            String         @id @default(cuid())
  employeeCode  String         @unique
  firstName     String
  lastName      String
  email         String         @unique
  phone         String?
  dateOfBirth   DateTime?
  gender        Gender?
  address       String?
  city          String?
  state         String?
  zipCode       String?
  country       String?        @default("India")

  // New personal fields
  maritalStatus          MaritalStatus?
  bloodGroup             String?
  qualification          String?
  experience             String?
  alternateMobile        String?
  personalEmail          String?
  permanentAddress       String?
  emergencyContactName   String?
  emergencyContactRelation String?
  emergencyContactNumber String?

  joiningDate   DateTime
  designation   String
  salary        Float?
  status        EmployeeStatus @default(ACTIVE)
  isActive      Boolean        @default(true)
  deactivatedAt DateTime?
  profilePhoto  String?

  // New employment fields
  grade            String?
  location         String?
  employmentType   EmploymentType   @default(PERMANENT)
  probationPeriod  Int?
  confirmationDate DateTime?
  resignationDate  DateTime?
  noticePeriod     Int?
  lastWorkingDate  DateTime?
  exitType         ExitType?
  exitReason       String?

  // New payroll / HR fields (restricted)
  ctc              Float?
  basicSalary      Float?
  grossSalary      Float?
  bankName         String?
  bankAccountNumber String?
  ifscCode         String?
  pfNumber         String?
  uanNumber        String?
  esiNumber        String?
  panNumber        String?
  aadhaarNumber    String?
  statutoryRemarks String?

  // Relations
  departmentId  String?
  department    Department?    @relation("DepartmentEmployees", fields: [departmentId], references: [id])

  managerId     String?
  manager       Employee?      @relation("ManagerSubordinates", fields: [managerId], references: [id])
  subordinates  Employee[]     @relation("ManagerSubordinates")

  user          User?
  attendance    Attendance[]
  leaveRequests Leave[]        @relation("EmployeeLeaves")
  approvedLeaves Leave[]       @relation("ApproverLeaves")
  leaveBalances LeaveBalance[]

  headOfDepartment Department? @relation("DepartmentHead")

  // New relations
  documents              EmployeeDocument[]
  travelRequests         TravelRequest[]       @relation("EmployeeTravelRequests")
  approvedTravelRequests TravelRequest[]       @relation("TravelApprover")
  assignedAssets         Asset[]               @relation("AssetAssignee")
  raisedRequisitions     Requisition[]         @relation("RequisitionRaiser")
  interviewedCandidates  Candidate[]           @relation("CandidateInterviewer")
  assignedInterviews     Interview[]            @relation("InterviewPanelMember")
  performanceReviews     PerformanceReview[]   @relation("EmployeeReviews")
  approvedReviews        PerformanceReview[]   @relation("ReviewApprover")
  trainingParticipations TrainingParticipant[]
  employeeRequests       EmployeeRequest[]
  policyAcknowledgements PolicyAcknowledgement[]
  notifications          Notification[]

  submittedOfficeExpenses OfficeExpense[] @relation("SubmittedOfficeExpenses")
  approvedOfficeExpenses  OfficeExpense[] @relation("ApprovedOfficeExpenses")

  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@map("employees")
}
```

### Department

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L414)

```prisma
model Department {
id          String  @id @default(cuid())
  name        String  @unique
  description String?

  headId String?   @unique
  head   Employee? @relation("DepartmentHead", fields: [headId], references: [id])

  employees Employee[] @relation("DepartmentEmployees")

  // New relations
  requisitions Requisition[]
  trainings    Training[]    @relation("TrainingDepartment")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("departments")
}
```

### Attendance

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L434)

```prisma
model Attendance {
id        String           @id @default(cuid())
  date      DateTime         @db.Date
  clockIn   DateTime?
  clockOut  DateTime?
  workHours Decimal?
  status    AttendanceStatus @default(PRESENT)
  notes     String?

  employeeId String
  employee   Employee @relation(fields: [employeeId], references: [id], onDelete: Restrict)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([employeeId, date])
  @@map("attendance")
}
```

### Leave

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L453)

```prisma
model Leave {
id        String      @id @default(cuid())
  leaveType LeaveType
  startDate DateTime    @db.Date
  endDate   DateTime    @db.Date
  totalDays      Decimal
  isHalfDay      Boolean  @default(false)
  isHourly       Boolean  @default(false)
  hourlyDuration Int?      // minutes, e.g. 60 for 1 hour
  halfDayPeriod  String?   // MORNING or AFTERNOON
  hourlyStartTime String? // Local time in HH:mm format
  reason    String
  status    LeaveStatus @default(PENDING)
  remarks   String?

  employeeId String
  employee   Employee @relation("EmployeeLeaves", fields: [employeeId], references: [id], onDelete: Restrict)

  approverId String?
  approver   Employee? @relation("ApproverLeaves", fields: [approverId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("leaves")
}
```

### LeaveBalance

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L480)

```prisma
model LeaveBalance {
id            String    @id @default(cuid())
  year          Int
  leaveType     LeaveType
  totalDays     Decimal
  usedDays      Decimal   @default(0)
  remainingDays Decimal

  employeeId String
  employee   Employee @relation(fields: [employeeId], references: [id], onDelete: Restrict)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([employeeId, year, leaveType])
  @@map("leave_balances")
}
```

### EmployeeDocument

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L504)

```prisma
model EmployeeDocument {
id                 String             @id @default(cuid())
  documentType       DocumentType
  documentName       String
  filePath           String
  verificationStatus VerificationStatus @default(UNVERIFIED)
  expiryDate         DateTime?

  employeeId String
  employee   Employee @relation(fields: [employeeId], references: [id], onDelete: Restrict)

  uploadedById String?
  uploadedBy   User?   @relation("DocumentUploader", fields: [uploadedById], references: [id])

  uploadDate DateTime @default(now())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@map("employee_documents")
}
```

### TravelRequest

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L527)

```prisma
model TravelRequest {
id                  String           @id @default(cuid())
  travelPurpose       String
  destination         String
  startDate           DateTime         @db.Date
  endDate             DateTime         @db.Date
  travelMode          TravelMode
  travelModes         TravelMode[]     @default([])
  amountRequired      Decimal?
  outboundAmountRequired Decimal?
  returnAmountRequired   Decimal?
  advanceRequested    Decimal?
  advanceApproved     Decimal?
  approvalStatus      ApprovalStatus   @default(APPROVAL_PENDING)
  approvalDate        DateTime?
  hotelExpense        Decimal?
  foodAllowance       Decimal?
  localConveyance     Decimal?
  otherExpenses       Decimal?
  totalExpenseClaimed Decimal?
  billUpload          String?
  amountPayable       Decimal?
  settlementStatus    SettlementStatus @default(UNSETTLED)
  settlementDate      DateTime?

  employeeId String
  employee   Employee @relation("EmployeeTravelRequests", fields: [employeeId], references: [id], onDelete: Restrict)

  approverId String?
  approver   Employee? @relation("TravelApprover", fields: [approverId], references: [id])

  verifiedById String?
  verifiedBy   User?   @relation("TravelVerifier", fields: [verifiedById], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("travel_requests")
}
```

### Asset

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L569)

```prisma
model Asset {
id                 String                @id @default(cuid())
  assetType          AssetType
  assetCategory      AssetCategory
  brandModel         String?
  serialNumber       String?               @unique
  purchaseDate       DateTime?
  purchaseValue      Decimal?
  vendor             String?
  warrantyExpiryDate DateTime?
  issueDate          DateTime?
  issueCondition     AssetCondition?
  assetLocation      String?
  returnDate         DateTime?
  returnCondition    AssetReturnCondition?
  status             AssetStatus           @default(IN_USE)
  remarks            String?

  assignedEmployeeId String?
  assignedEmployee   Employee? @relation("AssetAssignee", fields: [assignedEmployeeId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("assets")
}
```

### Requisition

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L598)

```prisma
model Requisition {
id                String            @id @default(cuid())
  positionTitle     String
  location          String?
  numberOfVacancies Int               @default(1)
  requisitionDate   DateTime          @default(now())
  status            RequisitionStatus @default(REQUIREMENT)
  stageUpdatedAt    DateTime          @default(now())
  closureSource     String?
  closureReason     String?

  departmentId String?
  department   Department? @relation(fields: [departmentId], references: [id])

  raisedById String?
  raisedBy   Employee? @relation("RequisitionRaiser", fields: [raisedById], references: [id])

  candidates Candidate[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("requisitions")
}
```

### Candidate

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L623)

```prisma
model Candidate {
currentStage      String @default("TELEPHONIC")
  stageEnteredAt    DateTime @default(now())
  stageHistory      CandidateStageHistory[]
  id                String           @id @default(cuid())
  candidateName     String
  mobile            String?
  email             String?
  qualification     String?
  totalExperience   Decimal?
  currentCompany    String?
  currentSalary     Decimal?
  expectedSalary    Decimal?
  noticePeriod      Int?
  source            String?
  resumePath        String?
  screeningStatus   ScreeningStatus  @default(SHORTLISTED)
  screeningNotes    String?
  interviewRound    String?
  interviewLocation String?
  interviewDate     DateTime?
  interviewFeedback String?
  interviewScore    Int?
  selectionStatus   SelectionStatus?
  offerStatus       OfferStatus?
  offerDate         DateTime?
  offeredSalary     Decimal?
  joiningDate       DateTime?
  joiningStatus     String           @default("PENDING")
  actualJoiningDate DateTime?
  rejectionStage    String?
  rejectionReason   String?
  recruitmentCost   Decimal?

  requisitionId String
  requisition   Requisition @relation(fields: [requisitionId], references: [id], onDelete: Restrict)

  interviewerId String?
  interviewer   Employee? @relation("CandidateInterviewer", fields: [interviewerId], references: [id])
  interviews    Interview[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("candidates")
  @@index([currentStage, stageEnteredAt])
}
```

### CandidateStageHistory

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L671)

```prisma
model CandidateStageHistory {
id String @id @default(cuid())
  candidateId String
  candidate Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  fromStage String
  toStage String
  actorId String
  reason String?
  createdAt DateTime @default(now())
  @@index([candidateId, createdAt])
  @@map("candidate_stage_history")
}
```

### Interview

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L684)

```prisma
model Interview {
id             String                     @id @default(cuid())
  candidateId    String
  candidate      Candidate                  @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  round          String
  startsAt       DateTime
  endsAt         DateTime
  timezone       String                     @default("Asia/Kolkata")
  mode           InterviewMode              @default(IN_PERSON)
  location       String?
  status         InterviewAppointmentStatus @default(SCHEDULED)
  feedback       String?
  draftFeedback  String?
  draftScore     Int?
  draftRecommendation String?
  feedbackSubmittedAt DateTime?
  feedbackSubmittedById String?
  score          Int?
  recommendation String?
  interviewerId  String?
  interviewer    Employee?                  @relation("InterviewPanelMember", fields: [interviewerId], references: [id])
  createdById    String?
  createdAt      DateTime                   @default(now())
  updatedAt      DateTime                   @updatedAt

  @@index([startsAt, status])
  @@index([candidateId, round, startsAt])
  @@index([interviewerId, startsAt])
  @@map("recruitment_interviews")
}
```

### PerformanceReview

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L725)

```prisma
model PerformanceReview {
id                           String         @id @default(cuid())
  reviewPeriod                 ReviewPeriod
  status                       ReviewStatus   @default(EMPLOYEE_REVIEW)
  kraDescription               String?
  kpiWeightage                 Decimal?
  goalDescription              String?
  targetValue                  String?
  achievedValue                String?
  selfRating                   Decimal?
  managerRating                Decimal?
  hrRating                     Decimal?
  finalRating                  Decimal?
  selfMetricRatings            Json?
  managerMetricRatings         Json?
  hrMetricRatings              Json?
  managerComments              String?
  employeeComments             String?
  hrComments                   String?
  strengths                    String?
  areasOfImprovement           String?
  trainingRequirement          String?
  promotionRecommendation      Boolean        @default(false)
  salaryRevisionRecommendation String?
  finalApprovalStatus          ApprovalStatus @default(APPROVAL_PENDING)
  finalApprovalDate            DateTime?

  employeeId String
  employee   Employee @relation("EmployeeReviews", fields: [employeeId], references: [id], onDelete: Restrict)

  finalApprovedById String?
  finalApprovedBy   Employee? @relation("ReviewApprover", fields: [finalApprovedById], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("performance_reviews")
}
```

### Training

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L766)

```prisma
model Training {
id               String       @id @default(cuid())
  trainingTopic    String
  trainingType     TrainingType
  trainerName      String?
  trainingDate     DateTime     @db.Date
    trainingEndDate  DateTime?    @db.Date
  trainingLocation String?
  trainingCost     Decimal?
  trainingHours    Decimal?

  targetDepartmentId String?
  targetDepartment   Department? @relation("TrainingDepartment", fields: [targetDepartmentId], references: [id])

  status           String       @default("PENDING") // PENDING, APPROVED, REJECTED

  participants TrainingParticipant[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("trainings")
}
```

### TrainingParticipant

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L790)

```prisma
model TrainingParticipant {
id                String                   @id @default(cuid())
  attendanceStatus  TrainingAttendanceStatus @default(TRAINING_PRESENT)
  feedbackRating    Decimal?
  feedbackComments  String?
  trainerFeedbackRating Decimal?
  trainerFeedbackComments String?
  assessmentScore   Decimal?
  certificateIssued Boolean                  @default(false)
  certificateFile   String?

  trainingId String
  training   Training @relation(fields: [trainingId], references: [id], onDelete: Restrict)

  employeeId String
  employee   Employee @relation(fields: [employeeId], references: [id], onDelete: Restrict)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([trainingId, employeeId])
  @@map("training_participants")
}
```

### EmployeeRequest

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L816)

```prisma
model EmployeeRequest {
id             String       @id @default(cuid())
  requestType    RequestType
  description    String
  status         TicketStatus @default(SUBMITTED)
  responseNotes  String?
  resolutionDate DateTime?
  closureDate    DateTime?
  slaDueDate     DateTime?

  employeeId String
  employee   Employee @relation(fields: [employeeId], references: [id], onDelete: Restrict)

  assignedToId String?
  assignedTo   User?   @relation("RequestAssignee", fields: [assignedToId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("employee_requests")
}
```

### Policy

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L840)

```prisma
model Policy {
id                      String         @id @default(cuid())
  policyName              String
  policyCategory          PolicyCategory
  versionNumber           String         @default("v1.0")
  filePath                String
  applicableTo            String         @default("ALL")
  acknowledgementRequired Boolean        @default(false)

  uploadedById String?
  uploadedBy   User?   @relation("PolicyUploader", fields: [uploadedById], references: [id])

  acknowledgements PolicyAcknowledgement[]

  uploadDate DateTime @default(now())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@map("policies")
}
```

### PolicyAcknowledgement

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L861)

```prisma
model PolicyAcknowledgement {
id                    String                @id @default(cuid())
  acknowledgementStatus AcknowledgementStatus @default(ACK_PENDING)
  acknowledgementDate   DateTime?

  policyId String
  policy   Policy @relation(fields: [policyId], references: [id], onDelete: Restrict)

  employeeId String
  employee   Employee @relation(fields: [employeeId], references: [id], onDelete: Restrict)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([policyId, employeeId])
  @@map("policy_acknowledgements")
}
```

### Notification

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L881)

```prisma
model Notification {
id               String           @id @default(cuid())
  notificationType NotificationType
  message          String
  triggerEvent     String?
  isRead           Boolean          @default(false)
  deliveryChannel  String           @default("IN_APP")

  recipientId String
  recipient   Employee @relation(fields: [recipientId], references: [id], onDelete: Restrict)

  createdAt DateTime @default(now())

  @@map("notifications")
}
```

### AuditLog

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L899)

```prisma
model AuditLog {
id               String  @id @default(cuid())
  actionPerformed  String
  moduleAffected   String
  recordIdAffected String?
  oldValue         String?
  newValue         String?
  ipAddress        String?

  userId String
  user   User   @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())

  @@map("audit_logs")
}
```

### LoginHistory

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L918)

```prisma
model LoginHistory {
id            String    @id @default(cuid())
  loginTime     DateTime  @default(now())
  logoutTime    DateTime?
  ipAddress     String?
  deviceBrowser String?

  userId String
  user   User   @relation("UserLoginHistory", fields: [userId], references: [id])

  @@map("login_history")
}
```

### ModulePermission

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L933)

```prisma
model ModulePermission {
id                String  @id @default(cuid())
  role              Role
  module            String
  canView           Boolean @default(false)
  canAdd            Boolean @default(false)
  canEdit           Boolean @default(false)
  canDelete         Boolean @default(false)
  canApprove        Boolean @default(false)
  canViewRestricted Boolean @default(false)
  canExport         Boolean @default(false)

  createdById String?
  createdBy   User?   @relation("PermissionCreator", fields: [createdById], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([role, module])
  @@map("module_permissions")
}
```

### OfficeExpense

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/prisma/schema.prisma#L972)

```prisma
model OfficeExpense {
id              String          @id @default(cuid())
  expenseDate     DateTime        @db.Date
  category        ExpenseCategory
  description     String
  amount          Decimal
  billUpload      String?
  status          ExpenseStatus   @default(PENDING)

  submittedById   String
  submittedBy     Employee        @relation("SubmittedOfficeExpenses", fields: [submittedById], references: [id])

  approvedById    String?
  approvedBy      Employee?       @relation("ApprovedOfficeExpenses", fields: [approvedById], references: [id])

  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}
```

## Enum and status vocabulary

### Role

```prisma
ADMIN
  HR
  MANAGER
  EMPLOYEE
```

### Gender

```prisma
MALE
  FEMALE
  OTHER
```

### EmployeeStatus

```prisma
ACTIVE
  INACTIVE
  ON_LEAVE
  RESIGNED
  TERMINATED
```

### AttendanceStatus

```prisma
PRESENT
  ABSENT
  HALF_DAY
  ON_LEAVE
  WEEKEND
  HOLIDAY
```

### LeaveType

```prisma
PERSONAL
  ON_DUTY
  CASUAL
  SICK
  EARNED
  UNPAID
  MATERNITY
  PATERNITY
```

### LeaveStatus

```prisma
PENDING
  APPROVED
  REJECTED
  CANCELLED
```

### MaritalStatus

```prisma
SINGLE
  MARRIED
  DIVORCED
  WIDOWED
```

### EmploymentType

```prisma
PERMANENT
  CONTRACT
  INTERN
```

### ExitType

```prisma
VOLUNTARY
  INVOLUNTARY
```

### DocumentType

```prisma
RESUME
  AADHAAR
  PAN
  EDUCATIONAL_CERTIFICATE
  EXPERIENCE_CERTIFICATE
  APPOINTMENT_LETTER
  OTHER
```

### VerificationStatus

```prisma
UNVERIFIED
  VERIFIED
  VERIFICATION_REJECTED
```

### TravelMode

```prisma
AIR
  TRAIN
  ROAD
  OWN_VEHICLE
```

### ApprovalStatus

```prisma
APPROVAL_PENDING
  APPROVAL_APPROVED
  APPROVAL_REJECTED
```

### SettlementStatus

```prisma
UNSETTLED
  SUBMITTED
  SETTLED
```

### AssetType

```prisma
LAPTOP
  DESKTOP
  MOBILE
  SIM
  ID_CARD
  LAPTOP_BAG
  VEHICLE
  TOOLS
  MACHINERY_TOOL
  ASSET_OTHER
```

### AssetCategory

```prisma
IT
  NON_IT
  VEHICLE_CAT
```

### AssetCondition

```prisma
NEW
  GOOD
  FAIR
```

### AssetReturnCondition

```prisma
RETURN_GOOD
  RETURN_DAMAGED
  RETURN_LOST
```

### AssetStatus

```prisma
IN_USE
  RETURN_REQUESTED
  RETURNED
  DAMAGED
  LOST
  RETIRED
```

### RequisitionStatus

```prisma
REQUIREMENT
  SOURCING
  TELEPHONIC
  HR_INTERVIEW
  TECHNICAL
  MANAGEMENT
  SELECTED
  OFFER
  JOINED_REJECTED
  CLOSED
```

### ScreeningStatus

```prisma
SCREENING_PENDING
  SHORTLISTED
  SCREENING_REJECTED
```

### SelectionStatus

```prisma
SELECTED
  SELECTION_REJECTED
  SELECTION_ON_HOLD
```

### OfferStatus

```prisma
NOT_RELEASED
  RELEASED
  OFFER_ACCEPTED
  OFFER_DECLINED
```

### InterviewAppointmentStatus

```prisma
SCHEDULED
  COMPLETED
  CANCELLED
  NO_SHOW
```

### InterviewMode

```prisma
IN_PERSON
  VIDEO
  PHONE
```

### ReviewPeriod

```prisma
MONTHLY
  QUARTERLY
  HALF_YEARLY
  ANNUAL
```

### TrainingType

```prisma
INTERNAL
  EXTERNAL
```

### TrainingAttendanceStatus

```prisma
TRAINING_PRESENT
  TRAINING_ABSENT
```

### RequestType

```prisma
HR_QUERY
  LEAVE_QUERY
  SALARY_QUERY
  DOCUMENT_REQUEST
  EXPERIENCE_LETTER
  PAYSLIP
  JOINING_DOCUMENTS
  GENERAL
  OTHER
```

### TicketStatus

```prisma
SUBMITTED
  ASSIGNED
  IN_PROGRESS
  RESOLVED
  TICKET_CLOSED
```

### PolicyCategory

```prisma
HR_POLICY
  LEAVE_POLICY
  ATTENDANCE_POLICY
  TRAVEL_POLICY
  CODE_OF_CONDUCT
  EMPLOYEE_HANDBOOK
  RECRUITMENT_POLICY
  PERFORMANCE_POLICY
  TRAINING_POLICY
  POSH
  SAFETY
  CIRCULAR
  FORM
  SOP
```

### AcknowledgementStatus

```prisma
ACK_PENDING
  ACKNOWLEDGED
```

### NotificationType

```prisma
JOINING
  INTERVIEW
  OFFER
  RESIGNATION
  TRAVEL_NOTIF
  ASSET_NOTIF
  REVIEW_DUE
  TRAINING_NOTIF
  QUERY_NOTIF
  POLICY_UPLOAD
```

### ReviewStatus

```prisma
EMPLOYEE_REVIEW
  MANAGER_REVIEW
  HR_REVIEW
  FINAL_APPROVAL
  COMPLETED
```

### ExpenseCategory

```prisma
STATIONERY
  FOOD_SNACKS
  MAINTENANCE
  UTILITIES
  IT_SOFTWARE
  OTHER
```

### ExpenseStatus

```prisma
PENDING
  APPROVED
  REJECTED
  PAID
```

## Runtime validation schemas

Exact Zod definitions from each feature. These describe declared validation; consult the route index to see which schema is mounted for an endpoint. Authorization and service business rules remain separate.

### assets

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/assets/asset.schema.ts#L1)

```typescript
import { z } from 'zod';

export const createAssetSchema = z.object({
  assetType: z.enum(['LAPTOP', 'DESKTOP', 'MOBILE', 'SIM', 'ID_CARD', 'LAPTOP_BAG', 'VEHICLE', 'TOOLS', 'MACHINERY_TOOL', 'ASSET_OTHER']),
  assetCategory: z.enum(['IT', 'NON_IT', 'VEHICLE_CAT']),
  brandModel: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchaseValue: z.number().optional(),
  assignedEmployeeId: z.string().nullable().optional(),
  issueDate: z.string().optional(),
  issueCondition: z.enum(['NEW', 'GOOD', 'FAIR']).optional(),
  assetLocation: z.string().optional(),
  status: z.enum(['IN_USE', 'RETURN_REQUESTED', 'RETURNED', 'DAMAGED', 'LOST', 'RETIRED']).optional()
});

export const updateAssetSchema = createAssetSchema.partial();

export const assignAssetSchema = z.object({
  assignedEmployeeId: z.string(), // Removed uuid() because it might be CUID from Prisma
  issueCondition: z.enum(['NEW', 'GOOD', 'FAIR']).optional()
});

export const returnAssetSchema = z.object({
  returnCondition: z.enum(['RETURN_GOOD', 'RETURN_DAMAGED', 'RETURN_LOST']).optional()
});
```

### auth

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/auth/auth.schema.ts#L1)

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email or Employee Code is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters')
});

export const setupPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters')
});
```

### departments

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/departments/department.schema.ts#L1)

```typescript
import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  description: z.string().optional(),
  headId: z.string().optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
```

### employees

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/document.schema.ts#L1)

```typescript
import { z } from 'zod';

export const uploadDocumentSchema = z.object({
  documentType: z.enum(['RESUME', 'AADHAAR', 'PAN', 'EDUCATIONAL_CERTIFICATE', 'EXPERIENCE_CERTIFICATE', 'APPOINTMENT_LETTER', 'OTHER']),
  documentName: z.string().min(1, 'Document name is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
});
```

### employees

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/employees/employee.schema.ts#L1)

```typescript
import { z } from 'zod';

export const createEmployeeSchema = z.object({
  employeeCode: z.string().min(1, 'Employee code is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Contact number must be exactly 10 digits').optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),

  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).optional(),
  alternateMobile: z.string().regex(/^[0-9]{10}$/, 'Contact number must be exactly 10 digits').optional(),
  bloodGroup: z.string().optional(),
  qualification: z.string().optional(),
  experience: z.string().optional(),
  personalEmail: z.string().email().optional().or(z.literal('')),
  permanentAddress: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  emergencyContactNumber: z.string().regex(/^[0-9]{10}$/, 'Contact number must be exactly 10 digits').optional(),

  joiningDate: z.string().min(1, 'Joining date is required'),
  designation: z.string().min(1, 'Designation is required'),
  salary: z.number().positive().optional(),
  departmentId: z.string().optional(),
  managerId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'TERMINATED']).optional(),
  isActive: z.boolean().optional(),
  profilePhoto: z.string().optional(),

  grade: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.enum(['PERMANENT', 'CONTRACT', 'INTERN']).optional(),
  probationPeriod: z.number().int().nonnegative().optional(),
  confirmationDate: z.string().optional(),
  resignationDate: z.string().optional(),
  noticePeriod: z.number().int().nonnegative().optional(),
  lastWorkingDate: z.string().optional(),
  exitType: z.enum(['RESIGNATION', 'TERMINATION', 'RETIREMENT']).optional(),
  exitReason: z.string().optional(),

  ctc: z.number().nonnegative().optional(),
  basicSalary: z.number().nonnegative().optional(),
  grossSalary: z.number().nonnegative().optional(),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  pfNumber: z.string().optional(),
  uanNumber: z.string().optional(),
  esiNumber: z.string().optional(),
  panNumber: z.string().optional(),
  aadhaarNumber: z.string().optional(),
  statutoryRemarks: z.string().optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial().extend({
  phone: createEmployeeSchema.shape.phone.nullable(),
  dateOfBirth: createEmployeeSchema.shape.dateOfBirth.nullable(),
  gender: createEmployeeSchema.shape.gender.nullable(),
  address: createEmployeeSchema.shape.address.nullable(),
  city: createEmployeeSchema.shape.city.nullable(),
  state: createEmployeeSchema.shape.state.nullable(),
  zipCode: createEmployeeSchema.shape.zipCode.nullable(),
  country: createEmployeeSchema.shape.country.nullable(),
  maritalStatus: createEmployeeSchema.shape.maritalStatus.nullable(),
  alternateMobile: createEmployeeSchema.shape.alternateMobile.nullable(),
  bloodGroup: createEmployeeSchema.shape.bloodGroup.nullable(),
  qualification: createEmployeeSchema.shape.qualification.nullable(),
  experience: createEmployeeSchema.shape.experience.nullable(),
  personalEmail: createEmployeeSchema.shape.personalEmail.nullable(),
  permanentAddress: createEmployeeSchema.shape.permanentAddress.nullable(),
  emergencyContactName: createEmployeeSchema.shape.emergencyContactName.nullable(),
  emergencyContactRelation: createEmployeeSchema.shape.emergencyContactRelation.nullable(),
  emergencyContactNumber: createEmployeeSchema.shape.emergencyContactNumber.nullable(),
  salary: createEmployeeSchema.shape.salary.nullable(),
  departmentId: createEmployeeSchema.shape.departmentId.nullable(),
  managerId: createEmployeeSchema.shape.managerId.nullable(),
  profilePhoto: createEmployeeSchema.shape.profilePhoto.nullable(),
  grade: createEmployeeSchema.shape.grade.nullable(),
  location: createEmployeeSchema.shape.location.nullable(),
  probationPeriod: createEmployeeSchema.shape.probationPeriod.nullable(),
  confirmationDate: createEmployeeSchema.shape.confirmationDate.nullable(),
  resignationDate: createEmployeeSchema.shape.resignationDate.nullable(),
  noticePeriod: createEmployeeSchema.shape.noticePeriod.nullable(),
  lastWorkingDate: createEmployeeSchema.shape.lastWorkingDate.nullable(),
  exitType: createEmployeeSchema.shape.exitType.nullable(),
  exitReason: createEmployeeSchema.shape.exitReason.nullable(),
  ctc: createEmployeeSchema.shape.ctc.nullable(),
  basicSalary: createEmployeeSchema.shape.basicSalary.nullable(),
  grossSalary: createEmployeeSchema.shape.grossSalary.nullable(),
  bankName: createEmployeeSchema.shape.bankName.nullable(),
  bankAccountNumber: createEmployeeSchema.shape.bankAccountNumber.nullable(),
  ifscCode: createEmployeeSchema.shape.ifscCode.nullable(),
  pfNumber: createEmployeeSchema.shape.pfNumber.nullable(),
  uanNumber: createEmployeeSchema.shape.uanNumber.nullable(),
  esiNumber: createEmployeeSchema.shape.esiNumber.nullable(),
  panNumber: createEmployeeSchema.shape.panNumber.nullable(),
  aadhaarNumber: createEmployeeSchema.shape.aadhaarNumber.nullable(),
  statutoryRemarks: createEmployeeSchema.shape.statutoryRemarks.nullable(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
```

### expenses

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/expenses/expense.schema.ts#L1)

```typescript
import { z } from 'zod';

export const createExpenseSchema = z.object({
  expenseDate: z.string(),
  category: z.enum(['STATIONERY', 'FOOD_SNACKS', 'MAINTENANCE', 'UTILITIES', 'IT_SOFTWARE', 'OTHER']),
  description: z.string().min(1),
  amount: z.number().min(0),
  billUpload: z.string().optional(),
});

export const updateExpenseStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'PAID']),
});
```

### leave

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/leave/leave.schema.ts#L1)

```typescript
import { z } from 'zod';

export const applyLeaveSchema = z.object({
  leaveType: z.enum(['PERSONAL', 'ON_DUTY', 'CASUAL', 'SICK', 'EARNED', 'UNPAID', 'MATERNITY', 'PATERNITY']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason must be under 500 characters'),
  isHalfDay: z.boolean().optional().default(false),
  isHourly: z.boolean().optional().default(false),
  hourlyDuration: z.number().int().min(30).max(480).optional(), // 30 min to 8 hours
  halfDayPeriod: z.enum(['MORNING', 'AFTERNOON']).optional(),
  hourlyStartTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Start time must be in HH:mm format').optional(),
}).superRefine((data, context) => {
  if (data.isHalfDay && data.isHourly) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Choose either half-day or hourly leave.' });
  }
  if (data.isHalfDay && !data.halfDayPeriod) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['halfDayPeriod'], message: 'Choose morning or afternoon.' });
  }
  if (data.isHourly && !data.hourlyStartTime) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['hourlyStartTime'], message: 'Start time is required for hourly leave.' });
  }
  if (data.isHourly && !data.hourlyDuration) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['hourlyDuration'], message: 'Choose an hourly leave duration.' });
  }
});

export const updateLeaveStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  remarks: z.string().optional(),
});

export type ApplyLeaveInput = z.infer<typeof applyLeaveSchema>;
export type UpdateLeaveStatusInput = z.infer<typeof updateLeaveStatusSchema>;
```

### performance

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/performance/performance.schema.ts#L1)

```typescript
import { z } from 'zod';

export const performanceMetricKeys = [
  'WORK_QUALITY',
  'PRODUCTIVITY_RELIABILITY',
  'COMMUNICATION',
  'COLLABORATION',
  'OWNERSHIP_INITIATIVE',
  'PROFESSIONAL_CONDUCT',
  'LEARNING_ADAPTABILITY'
] as const;

const metricRatingsSchema = z.record(
  z.enum(performanceMetricKeys),
  z.coerce.number().min(1).max(5)
);

export const createPerformanceReviewSchema = z.object({
  employeeId: z.string(),
  reviewPeriod: z.enum(['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL']),
  kraDescription: z.string().nullish(),
  kpiWeightage: z.coerce.number().nullish(),
  goalDescription: z.string().nullish(),
  targetValue: z.string().nullish()
});

export const updatePerformanceReviewSchema = z.object({
  reviewPeriod: z.enum(['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL']),
  kraDescription: z.string().nullish(),
  kpiWeightage: z.coerce.number().nullish(),
  goalDescription: z.string().nullish(),
  targetValue: z.string().nullish()
});

export const selfAppraisalSchema = z.object({
  achievedValue: z.string().nullish(),
  metricRatings: metricRatingsSchema,
  selfRating: z.coerce.number().min(1).max(5).nullish(),
  employeeComments: z.string().nullish(),
  strengths: z.string().nullish(),
  areasOfImprovement: z.string().nullish(),
  trainingRequirement: z.string().nullish()
});

export const managerAppraisalSchema = z.object({
  metricRatings: metricRatingsSchema,
  managerRating: z.coerce.number().min(1).max(5).nullish(),
  managerComments: z.string().nullish(),
  promotionRecommendation: z.boolean().nullish(),
  salaryRevisionRecommendation: z.string().nullish()
});

export const hrAppraisalSchema = z.object({
  metricRatings: metricRatingsSchema,
  hrRating: z.coerce.number().min(1).max(5).nullish(),
  hrComments: z.string().nullish()
});

export const finalAppraisalSchema = z.object({
  finalRating: z.coerce.number().min(1).max(5).nullish(),
  finalApprovalStatus: z.enum(['APPROVAL_PENDING', 'APPROVAL_APPROVED', 'APPROVAL_REJECTED']).nullish()
});
```

### permissions

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/permissions/permission.schema.ts#L1)

```typescript
import { z } from 'zod';
import { MODULES } from './permission.catalog';

const moduleKeys = MODULES.map((m) => m.key) as [string, ...string[]];

export const updatePermissionSchema = z.object({
  role: z.enum(['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE']),
  module: z.enum(moduleKeys),
  canView: z.boolean().optional(),
  canAdd: z.boolean().optional(),
  canEdit: z.boolean().optional(),
  canDelete: z.boolean().optional(),
  canApprove: z.boolean().optional(),
  canViewRestricted: z.boolean().optional(),
  canExport: z.boolean().optional(),
});

export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;
```

### policies

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/policies/policy.schema.ts#L1)

```typescript
import { z } from 'zod';

export const createPolicySchema = z.object({
  policyName: z.string().min(1, 'Policy Name is required'),
  policyCategory: z.enum([
    'HR_POLICY', 'LEAVE_POLICY', 'ATTENDANCE_POLICY', 'TRAVEL_POLICY', 'CODE_OF_CONDUCT', 'EMPLOYEE_HANDBOOK',
    'RECRUITMENT_POLICY', 'PERFORMANCE_POLICY', 'TRAINING_POLICY', 'POSH', 'SAFETY', 'CIRCULAR', 'FORM', 'SOP'
  ]),
  versionNumber: z.string().default('v1.0'),
  filePath: z.string().min(1, 'File attachment is required'),
  acknowledgementRequired: z.boolean().default(false)
});

export const updatePolicySchema = z.object({
  policyName: z.string().optional(),
  policyCategory: z.enum([
    'HR_POLICY', 'LEAVE_POLICY', 'ATTENDANCE_POLICY', 'TRAVEL_POLICY', 'CODE_OF_CONDUCT', 'EMPLOYEE_HANDBOOK',
    'RECRUITMENT_POLICY', 'PERFORMANCE_POLICY', 'TRAINING_POLICY', 'POSH', 'SAFETY', 'CIRCULAR', 'FORM', 'SOP'
  ]).optional(),
  versionNumber: z.string().optional(),
  filePath: z.string().optional(),
  acknowledgementRequired: z.boolean().optional()
});

export const acknowledgePolicySchema = z.object({
  status: z.enum(['ACKNOWLEDGED'])
});
```

### recruitment

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/recruitment/recruitment.schema.ts#L1)

```typescript
import { z } from "zod";
export const candidateStages = ["TELEPHONIC", "HR_INTERVIEW", "TECHNICAL", "MANAGEMENT", "OFFER", "JOINED"] as const;
export const candidateStageSchema = z.object({
  stage: z.enum(candidateStages),
  expectedStage: z.enum(candidateStages),
  reason: z.string().trim().min(1).max(1000).optional(),
});
const interviewRoundSchema = z.enum([
  "TELEPHONIC",
  "HR_INTERVIEW",
  "TECHNICAL",
  "MANAGEMENT",
]);
const schedulableInterviewRoundSchema = z.enum([
  "HR_INTERVIEW",
  "TECHNICAL",
  "MANAGEMENT",
]);
const dateSchema = z.string().datetime({ offset: true });

export const createRequisitionSchema = z.object({
  positionTitle: z.string().min(1),
  location: z.string().min(1),
  numberOfVacancies: z.number().int().min(1),
  requisitionDate: dateSchema.optional(),
  departmentId: z.string(),
});

export const updateRequisitionSchema = z.object({
  positionTitle: z.string().trim().min(1).optional(),
  departmentId: z.string().min(1).optional(),
  location: z.string().trim().min(1).optional(),
  numberOfVacancies: z.number().int().min(1).optional(),
});

export const updateRequisitionStatusSchema = z.object({
  reason: z.string().trim().min(1).max(1000).optional(),
  status: z.enum([
    "REQUIREMENT",
    "SOURCING",
    "TELEPHONIC",
    "HR_INTERVIEW",
    "TECHNICAL",
    "MANAGEMENT",
    "SELECTED",
    "OFFER",
    "JOINED_REJECTED",
    "CLOSED",
  ]),
});

export const createCandidateSchema = z.object({
  candidateName: z.string().min(1),
  mobile: z.string().optional(),
  email: z.string().email().optional(),
  qualification: z.string().optional(),
  totalExperience: z.number().min(0).optional(),
  currentCompany: z.string().optional(),
  currentSalary: z.number().min(0).optional(),
  expectedSalary: z.number().min(0).optional(),
  noticePeriod: z.number().int().min(0).optional(),
  source: z.string().optional(),
  requisitionId: z.string(),
  interviewDate: dateSchema.optional(),
  interviewerId: z.string().optional(),
  interviewRound: schedulableInterviewRoundSchema.optional(),
  interviewLocation: z.string().optional(),
  interviewDurationMinutes: z.number().int().min(15).max(480).optional(),
  interviewMode: z.enum(["IN_PERSON", "VIDEO", "PHONE"]).optional(),
});

export const interviewCandidateSchema = z.object({
  reason: z.string().trim().min(1).max(1000).optional(),
  interviewRound: interviewRoundSchema.optional(),
  interviewDate: dateSchema.optional(),
  interviewLocation: z.string().trim().min(1).optional(),
  interviewFeedback: z.string().optional(),
  interviewScore: z.number().int().min(0).optional(),
  selectionStatus: z
    .enum(["SELECTED", "SELECTION_REJECTED", "SELECTION_ON_HOLD"])
    .nullable()
    .optional(),
  interviewerId: z.string().optional(),
});

export const offerCandidateSchema = z.object({
  offerStatus: z.enum([
    "NOT_RELEASED",
    "RELEASED",
    "OFFER_ACCEPTED",
    "OFFER_DECLINED",
  ]),
  offerDate: dateSchema.optional(),
  offeredSalary: z.number().min(0).optional(),
  joiningDate: dateSchema.optional(),
  joiningStatus: z.enum(["PENDING", "JOINED", "NOT_JOINED"]).optional(),
  actualJoiningDate: dateSchema.optional(),
});

const interviewScheduleFields = z.object({
  reason: z.string().trim().min(1).max(1000).optional(),
  round: interviewRoundSchema,
  startsAt: dateSchema,
  endsAt: dateSchema,
  timezone: z.string().min(1).default("Asia/Kolkata"),
  mode: z.enum(["IN_PERSON", "VIDEO", "PHONE"]).default("IN_PERSON"),
  location: z.string().optional(),
  interviewerId: z.string().optional(),
});

export const createInterviewSchema = interviewScheduleFields.extend({
  round: schedulableInterviewRoundSchema,
}).refine(
  (value) => new Date(value.endsAt) > new Date(value.startsAt),
  {
    path: ["endsAt"],
    message: "End time must be after start time",
  },
);

export const updateInterviewScheduleSchema = interviewScheduleFields
  .extend({
    reason: z.string().trim().min(1).max(1000).default("Rescheduled"),
  })
  .refine((value) => new Date(value.endsAt) > new Date(value.startsAt), {
    path: ["endsAt"],
    message: "End time must be after start time",
  });

export const updateInterviewStatusSchema = z
  .object({
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
    reason: z.string().trim().min(1).max(1000).optional(),
  })
  .refine(
    (value) =>
      !["CANCELLED", "NO_SHOW"].includes(value.status) || !!value.reason,
    {
      path: ["reason"],
      message: "A reason is required when cancelling or marking a no-show",
    },
  );

export const interviewFeedbackSchema = z.object({
  draft: z.boolean().default(false),
  revisionReason: z.string().trim().min(1).optional(),
  feedback: z.string().trim().min(1),
  score: z.number().int().min(1).max(10).optional(),
  recommendation: z.enum(["STRONG_YES", "YES", "HOLD", "NO"]).optional(),
});
```

### requests

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/requests/request.schema.ts#L1)

```typescript
import { z } from 'zod';

export const createRequestSchema = z.object({
  requestType: z.enum(['HR_QUERY', 'LEAVE_QUERY', 'SALARY_QUERY', 'DOCUMENT_REQUEST', 'EXPERIENCE_LETTER', 'PAYSLIP', 'JOINING_DOCUMENTS', 'GENERAL', 'OTHER']),
  description: z.string().min(1, 'Description is required')
});

export const assignRequestSchema = z.object({
  assignedToId: z.string()
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'TICKET_CLOSED']),
  responseNotes: z.string().optional()
});
```

### training

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/training/training.schema.ts#L1)

```typescript
import { z } from 'zod';

export const createTrainingSchema = z.object({
  trainingTopic: z.string().min(1),
  trainingType: z.enum(['INTERNAL', 'EXTERNAL']),
  trainerName: z.string().optional(),
  trainingDate: z.string(),
  trainingEndDate: z.string().optional(), // Let string be parsed
  trainingLocation: z.string().optional(),
  trainingCost: z.number().min(0).optional(),
  trainingHours: z.number().min(0).optional(),
  targetDepartmentId: z.string().optional(),
  status: z.string().optional()
});

export const updateTrainingSchema = createTrainingSchema.partial();

export const addParticipantSchema = z.object({
  employeeId: z.string()
});

export const submitFeedbackSchema = z.object({
  feedbackRating: z.number().min(1).max(5).optional(),
  feedbackComments: z.string().optional(),
  trainerFeedbackRating: z.number().min(1).max(5).optional(),
  trainerFeedbackComments: z.string().optional()
});

export const recordAssessmentSchema = z.object({
  attendanceStatus: z.enum(['TRAINING_PRESENT', 'TRAINING_ABSENT']).optional(),
  assessmentScore: z.number().min(1).max(100).optional(),
  certificateIssued: z.boolean().optional(),
  certificateFile: z.string().optional()
});
```

### travel

[Schema source](https://github.com/Durgaprasad0513/HR_Portal/blob/5c6cc757828b5060e3ab63e23915d2501b584370/server/src/modules/travel/travel.schema.ts#L1)

```typescript
import { z } from 'zod';

export const createTravelSchema = z.object({
  travelPurpose: z.string().min(1),
  destination: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  travelMode: z.enum(['AIR', 'TRAIN', 'ROAD', 'OWN_VEHICLE']),
  travelModes: z.array(z.enum(['AIR', 'TRAIN', 'ROAD', 'OWN_VEHICLE'])).min(1).optional(),
  amountRequired: z.number().positive(),
  outboundAmountRequired: z.number().min(0).optional(),
  returnAmountRequired: z.number().min(0).optional(),
  billUpload: z.string().optional()
}).superRefine((data, context) => {
  if (data.travelModes && !data.travelModes.includes(data.travelMode)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['travelModes'], message: 'The primary travel mode must be selected.' });
  }

  if (data.outboundAmountRequired != null || data.returnAmountRequired != null) {
    const expectedTotal = Math.round(((data.outboundAmountRequired ?? 0) + (data.returnAmountRequired ?? 0) + Number.EPSILON) * 100) / 100;
    if (Math.abs(data.amountRequired - expectedTotal) > 0.005) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['amountRequired'], message: 'Amount required must equal the outbound and return amounts.' });
    }
  }
});

export const updateApprovalSchema = z.object({
  approvalStatus: z.enum(['APPROVED', 'REJECTED', 'APPROVAL_APPROVED', 'APPROVAL_REJECTED']),
  advanceApproved: z.number().min(0).optional(),
  rejectionReason: z.string().optional()
});

export const updateSettlementSchema = z.object({
  hotelExpense: z.number().min(0).optional(),
  foodAllowance: z.number().min(0).optional(),
  localConveyance: z.number().min(0).optional(),
  otherExpenses: z.number().min(0).optional(),
  settlementStatus: z.literal('SETTLED').optional()
});

export const submitExpenseSchema = z.object({
  hotelExpense: z.number().min(0).default(0),
  foodAllowance: z.number().min(0).default(0),
  localConveyance: z.number().min(0).default(0),
  otherExpenses: z.number().min(0).default(0),
  billUpload: z.string().optional()
});
```

## Package scripts

### root

| Script | Definition |
|---|---|
| `dev` | `concurrently "npm run dev:server" "npm run dev:client"` |
| `dev:server` | `cd server && npm run dev` |
| `dev:client` | `cd client && npm run dev` |
| `build` | `npm run build:server && npm run build:client` |
| `build:server` | `cd server && npm run build` |
| `build:client` | `cd client && npm run build` |
| `db:push` | `cd server && npx prisma db push` |
| `db:seed` | `cd server && npx prisma db seed` |
| `db:studio` | `cd server && npx prisma studio` |
| `verify` | `npm run build --prefix client && npm run build --prefix server && npm run test --prefix server` |
| `test` | `npm run test --prefix server` |
| `lint` | `npm run lint --prefix client && npm run lint --prefix server` |

Dependencies (versions declared by package.json; the lockfile determines installation):

- `concurrently`: `^8.2.2`

### client

| Script | Definition |
|---|---|
| `dev` | `vite` |
| `build` | `tsc -b && vite build` |
| `lint` | `eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0` |
| `preview` | `vite preview` |
| `test` | `vitest run` |
| `test:watch` | `vitest` |

Dependencies (versions declared by package.json; the lockfile determines installation):

- `@dnd-kit/core`: `^6.3.1`
- `@dnd-kit/sortable`: `^10.0.0`
- `@dnd-kit/utilities`: `^3.2.2`
- `@radix-ui/react-dialog`: `^1.1.23`
- `@tailwindcss/vite`: `^4.3.3`
- `@tanstack/react-query`: `^5.0.0`
- `@tanstack/react-table`: `^8.21.3`
- `axios`: `^1.6.0`
- `clsx`: `^2.1.0`
- `cmdk`: `^1.1.1`
- `cmk`: `^0.1.1`
- `date-fns`: `^3.3.1`
- `framer-motion`: `^13.2.0`
- `lucide-react`: `^0.330.0`
- `mammoth`: `^1.13.0`
- `next-themes`: `^0.4.6`
- `pdfjs-dist`: `^6.4.299`
- `qrcode.react`: `^4.2.0`
- `react`: `^18.2.0`
- `react-dom`: `^18.2.0`
- `react-hot-toast`: `^2.4.1`
- `react-router-dom`: `^7.18.2`
- `recharts`: `^3.10.1`
- `tailwind-merge`: `^2.2.1`
- `tailwindcss`: `^4.0.0`
- `@testing-library/jest-dom`: `^6.9.1`
- `@testing-library/react`: `^16.3.3`
- `@testing-library/user-event`: `^14.6.7`
- `@types/react`: `^18.2.56`
- `@types/react-dom`: `^18.2.19`
- `@typescript-eslint/eslint-plugin`: `^7.18.0`
- `@typescript-eslint/parser`: `^7.18.0`
- `@vitejs/plugin-react`: `^4.2.1`
- `eslint`: `^8.57.1`
- `eslint-plugin-react`: `^7.37.5`
- `eslint-plugin-react-hooks`: `^4.6.2`
- `jsdom`: `^25.0.1`
- `typescript`: `^5.2.2`
- `vite`: `^5.1.4`
- `vitest`: `^2.1.9`

### server

| Script | Definition |
|---|---|
| `dev` | `tsx watch src/server.ts` |
| `build` | `prisma generate && tsc` |
| `start` | `node dist/server.js` |
| `lint` | `eslint src/` |
| `prisma:generate` | `prisma generate` |
| `prisma:push` | `prisma db push` |
| `prisma:seed` | `prisma db seed` |
| `prisma:studio` | `prisma studio` |
| `test` | `jest --runInBand` |
| `test:watch` | `jest --watch` |

Dependencies (versions declared by package.json; the lockfile determines installation):

- `@aws-sdk/client-s3`: `^3.1149.0`
- `@prisma/client`: `6.4.0`
- `bcryptjs`: `^2.4.3`
- `cors`: `^2.8.5`
- `dotenv`: `^16.4.5`
- `express`: `^4.21.1`
- `jsonwebtoken`: `^9.0.2`
- `multer`: `^1.4.5-lts.1`
- `zod`: `^3.23.8`
- `@types/bcryptjs`: `^2.4.6`
- `@types/cors`: `^2.8.17`
- `@types/express`: `^5.0.0`
- `@types/jest`: `^30.0.0`
- `@types/jsonwebtoken`: `^9.0.7`
- `@types/multer`: `^1.4.12`
- `@types/node`: `^22.9.0`
- `@types/supertest`: `^6.0.3`
- `prisma`: `6.4.0`
- `tsx`: `^4.19.2`
- `typescript`: `^5.6.3`
- `@typescript-eslint/eslint-plugin`: `^8.70.0`
- `@typescript-eslint/parser`: `^8.70.0`
- `eslint`: `^8.57.1`
- `jest`: `^30.5.1`
- `supertest`: `^7.2.2`
- `ts-jest`: `^29.4.12`
