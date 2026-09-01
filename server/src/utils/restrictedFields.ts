import { ModuleKey } from '../modules/permissions/permission.catalog';
import {
  ASSET_RESTRICTED_FIELDS,
  CANDIDATE_RESTRICTED_FIELDS,
  EMPLOYEE_RESTRICTED_FIELDS,
  PERFORMANCE_RESTRICTED_FIELDS,
} from '../modules/permissions/permission.catalog';

const FIELDS_BY_MODULE: Record<string, readonly string[]> = {
  employees: EMPLOYEE_RESTRICTED_FIELDS,
  recruitment: CANDIDATE_RESTRICTED_FIELDS,
  assets: ASSET_RESTRICTED_FIELDS,
  performance: PERFORMANCE_RESTRICTED_FIELDS,
};

export function stripRestrictedFields<T>(record: T, module: ModuleKey, canViewRestricted: boolean): T {
  if (!record || canViewRestricted) {
    if (record && canViewRestricted && module === 'employees') {
      return maskAadhaar(record);
    }
    return record;
  }

  const fields = FIELDS_BY_MODULE[module];
  if (!fields) return record;

  if (Array.isArray(record)) {
    return record.map((item) => stripRestrictedFields(item, module, false)) as T;
  }

  const copy = { ...(record as Record<string, unknown>) };
  for (const field of fields) {
    if (field in copy) copy[field] = null;
  }
  return copy as T;
}

export function omitRestrictedFromPayload<T extends Record<string, unknown>>(
  payload: T,
  module: ModuleKey,
  canViewRestricted: boolean
): T {
  if (canViewRestricted) return payload;
  const fields = FIELDS_BY_MODULE[module];
  if (!fields) return payload;

  const copy = { ...payload };
  for (const field of fields) {
    delete copy[field];
  }
  return copy;
}

function maskAadhaar<T>(record: T): T {
  if (Array.isArray(record)) {
    return record.map((item) => maskAadhaar(item)) as T;
  }
  const copy = { ...(record as Record<string, unknown>) };
  const aadhaar = copy.aadhaarNumber;
  if (typeof aadhaar === 'string' && aadhaar.length > 4) {
    copy.aadhaarNumber = `${'*'.repeat(Math.max(0, aadhaar.length - 4))}${aadhaar.slice(-4)}`;
  }
  return copy as T;
}
