/**
 * Incident DTO - Re-exports shared validation schemas
 * Validation logic is centralized in @bandi/interfaces (using Yup)
 */
export {
  CreateIncidentSchema,
  DraftIncidentSchema,
  UpdateIncidentSchema,
  IncidentIdSchema,
  type CreateIncidentDto,
  type UpdateIncidentDto,
} from '@bandi/interfaces';
