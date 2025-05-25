import type { StateGraduationRequirement } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, BookText, Scaling } from 'lucide-react';

interface StateGraduationInfoProps {
  state: StateGraduationRequirement;
  onSelectAnother: () => void;
}

export default function StateGraduationInfo({ state, onSelectAnother }: StateGraduationInfoProps) {
  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Graduation Requirements for {state.name}</CardTitle>
        <CardDescription>
          The following information is provided by the {state.name} Department of Education.
          Please verify all information with official state resources.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-primary-600 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-accent" />
            Key Documents & Information <cite className="text-xs not-italic text-muted-foreground ml-1">[cite: 33]</cite>
          </h3>
          <ul className="list-disc list-inside space-y-2 pl-2 text-sm">
            <li>
              <a href={state.officialRequirementsUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center">
                Official State Graduation Requirements Page <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </li>
            {state.transcriptInfoGuidelines && (
              <li className="flex items-center">
                 <BookText className="h-4 w-4 mr-2 text-muted-foreground" />
                Transcript Information Guidelines: {state.transcriptInfoGuidelines.startsWith('http') ? <a href={state.transcriptInfoGuidelines} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-1 flex items-center">{state.transcriptInfoGuidelines} <ExternalLink className="h-4 w-4 ml-1" /></a> : state.transcriptInfoGuidelines }
              </li>
            )}
            {state.gradingScalesOverview && (
              <li className="flex items-center">
                <Scaling className="h-4 w-4 mr-2 text-muted-foreground" />
                State Grading Scales Overview: {state.gradingScalesOverview.startsWith('http') ? <a href={state.gradingScalesOverview} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-1 flex items-center">{state.gradingScalesOverview} <ExternalLink className="h-4 w-4 ml-1" /></a> : state.gradingScalesOverview }
              </li>
            )}
            {state.courseDescriptionsLink && (
              <li className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                Course Descriptions: <a href={state.courseDescriptionsLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-1 flex items-center">{state.courseDescriptionsLink} <ExternalLink className="h-4 w-4 ml-1" /></a>
              </li>
            )}
          </ul>
        </div>
        <Button onClick={onSelectAnother} variant="outline" className="mt-6">
          Select Another State
        </Button>
      </CardContent>
    </Card>
  );
}
