import { Schema, model } from 'mongoose';

interface IStateGraduationRequirement {
  id: string;
  name: string;
  officialRequirementsUrl: string;
  transcriptInfoGuidelines?: string;
  gradingScalesOverview?: string;
  courseDescriptionsLink?: string;
}

const stateRequirementSchema = new Schema<IStateGraduationRequirement>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  officialRequirementsUrl: { type: String, required: true },
  transcriptInfoGuidelines: String,
  gradingScalesOverview: String,
  courseDescriptionsLink: String
});

export const StateGraduationRequirement = model<IStateGraduationRequirement>('StateGraduationRequirement', stateRequirementSchema);
