"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAgents, { AgentStatus } from "@/hooks/data/useAgents";
import { useTranslations } from "@/hooks/useTranslations";
import {
  ArrowLeft,
  Bot,
  Edit,
  Loader2,
  Pause,
  Play,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const AgentDetailPage = () => {
  const { t } = useTranslations();
  const router = useRouter();
  const params = useParams();

  const agentId = params?.id ? parseInt(params.id as string) : null;

  const {
    useAgent,
    deleteAgent,
    activateAgent,
    deactivateAgent,
    isDeletingAgent,
    isActivatingAgent,
    isDeactivatingAgent,
  } = useAgents();

  const { data: agent, isLoading, error } = useAgent(agentId || 0);

  const handleEdit = () => {
    router.push(`/dashboard/agents/${agentId}/edit`);
  };

  const handleDelete = () => {
    if (agent && confirm(`Are you sure you want to delete "${agent.name}"?`)) {
      deleteAgent(agent.id, {
        onSuccess: () => {
          router.push("/dashboard/agents");
        },
      });
    }
  };

  const handleToggleStatus = () => {
    if (!agent) return;

    if (agent.status === AgentStatus.ACTIVE) {
      deactivateAgent(agent.id);
    } else {
      activateAgent(agent.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Loading agent...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="flex flex-1 items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Bot className="w-16 h-16 text-gray-400" />
          <h2 className="text-xl font-semibold">Agent not found</h2>
          <p className="text-muted-foreground">
            The agent you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/dashboard/agents")}>
            Back to Agents
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.ACTIVE:
        return "bg-green-100 text-green-700 border-green-200";
      case AgentStatus.TRAINING:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case AgentStatus.MAINTENANCE:
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex flex-1 flex-col p-4 pt-0 h-screen">
      <Card className="flex flex-col flex-1 overflow-hidden">
        <CardHeader className="px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/agents")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  {agent.name}
                </CardTitle>
                <CardDescription>
                  {agent.description || "No description provided"}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleStatus}
                disabled={isActivatingAgent || isDeactivatingAgent}
                className={
                  agent.status === AgentStatus.ACTIVE
                    ? "text-orange-600 hover:text-orange-700"
                    : "text-green-600 hover:text-green-700"
                }
              >
                {isActivatingAgent || isDeactivatingAgent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : agent.status === AgentStatus.ACTIVE ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {agent.status === AgentStatus.ACTIVE
                  ? "Deactivate"
                  : "Activate"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeletingAgent}
                className="text-red-600 hover:text-red-700"
              >
                {isDeletingAgent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Model Provider
                    </label>
                    <p className="mt-1 text-sm">{agent.modelProvider}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Model Name
                    </label>
                    <p className="mt-1 text-sm">{agent.modelName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Created
                    </label>
                    <p className="mt-1 text-sm">
                      {new Date(agent.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Last Updated
                    </label>
                    <p className="mt-1 text-sm">
                      {new Date(agent.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  {agent.shop && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Shop
                      </label>
                      <p className="mt-1 text-sm">{agent.shop.name}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Agent Prompt */}
            <Card>
              <CardHeader>
                <CardTitle>Agent Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border">
                  {agent.prompt}
                </pre>
              </CardContent>
            </Card>

            {/* Model Configuration */}
            {agent.modelConfig && (
              <Card>
                <CardHeader>
                  <CardTitle>Model Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border">
                    {JSON.stringify(agent.modelConfig, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Associated Users */}
            {agent.users && agent.users.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Associated Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agent.users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDetailPage;
