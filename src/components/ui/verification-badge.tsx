import { CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VerificationBadgeProps {
  status: 'pending' | 'verified' | 'rejected';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  tooltipText?: string;
}

const VerificationBadge = ({ 
  status, 
  size = 'md', 
  showText = true, 
  className = "",
  tooltipText 
}: VerificationBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          text: 'Verified',
          variant: 'default' as const,
          className: 'bg-success text-success-foreground hover:bg-success/90',
          tooltip: tooltipText || 'This provider has been verified and approved by our admin team'
        };
      case 'rejected':
        return {
          icon: XCircle,
          text: 'Rejected',
          variant: 'destructive' as const,
          className: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          tooltip: tooltipText || 'This application was rejected. Please review the feedback and resubmit.'
        };
      case 'pending':
      default:
        return {
          icon: Clock,
          text: 'Pending Review',
          variant: 'secondary' as const,
          className: 'bg-warning text-warning-foreground hover:bg-warning/90',
          tooltip: tooltipText || 'Verification request is under review by our admin team'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs';

  const badgeContent = (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${textSize} ${className}`}
    >
      <Icon className={`${iconSize} ${showText ? 'mr-1' : ''}`} />
      {showText && config.text}
    </Badge>
  );

  if (tooltipText !== null) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badgeContent}
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-sm">{config.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badgeContent;
};

export { VerificationBadge };