import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useParticipants from "@/hooks/data/cs/useParticipants";
import { useTranslations } from "@/hooks/useTranslations";
import { Crown, Plus, Shield, User, X } from "lucide-react";
import { useState } from "react";
import AddParticipantDialog from "./AddparticipantDialog";

interface ParticipantManagementSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
}

const ParticipantManagementSheet = ({
  open,
  onOpenChange,
  conversationId,
}: ParticipantManagementSheetProps) => {
  const { t } = useTranslations();
  const { removeParticipant, participants, addParticipants } =
    useParticipants(conversationId);
  // const { user } = useCS();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddParticipants = (selectedUserIds: string[]) => {
    addParticipants({
      conversationId: conversationId,
      participantIds: selectedUserIds,
    });

    setShowAddDialog(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case "admin":
        return <Shield className="h-3 w-3 text-blue-500" />;
      default:
        return <User className="h-3 w-3 text-gray-500" />;
    }
  };
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "owner":
        return t("dashboard.chat.owner");
      case "admin":
        return t("dashboard.chat.admin");
      default:
        return t("dashboard.chat.member");
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        {" "}
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{t("dashboard.chat.participantManagement")}</SheetTitle>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Current Members */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">
                  {t("dashboard.chat.member")} ({participants.length})
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("dashboard.chat.addParticipant")}
                </Button>
              </div>{" "}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {participants?.map((participant) => {
                  return (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={participant?.avatar} />
                          <AvatarFallback>
                            {participant?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>{" "}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">
                              {participant?.name}
                            </p>
                            {getRoleIcon(participant?.role as string)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            participant.role === "owner"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {getRoleLabel(participant?.role as string)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            removeParticipant({
                              conversationId: conversationId,
                              participantIds: [participant.id],
                            })
                          }
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />
          </div>
        </SheetContent>
      </Sheet>

      <AddParticipantDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        existingParticipantIds={
          participants
            .filter((p) => p.memberType === "user")
            .map((p) => p.systemId) ?? []
        }
        conversationId={conversationId}
        onAddParticipants={handleAddParticipants}
      />
    </>
  );
};

export default ParticipantManagementSheet;
