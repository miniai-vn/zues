interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({
  title = "Select a conversation",
  description = "Choose a conversation to start messaging",
  icon,
}: EmptyStateProps) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-muted/10">
      <div className="text-center space-y-3">
        {icon && (
          <div className="flex justify-center text-muted-foreground/50">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-medium text-muted-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
