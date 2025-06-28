// This file re-exports the create page component to handle edit mode
// The create page component already handles both create and edit modes based on the presence of an ID

"use client";
import AgentConfigurationUI from "../../create/page";

// Re-export the same component for edit mode
// The component automatically detects edit mode based on the presence of the 'id' parameter
export default function EditAgentPage() {
  //   const params = useParams();
  //   const id = params.id as string;
  //   console.log("EditAgentPage params:", params.id);

  return <AgentConfigurationUI />;
}
