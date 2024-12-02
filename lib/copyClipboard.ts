import { useToast } from "@/hooks/use-toast";

export const useCopyClipboard = () => {
  const { toast } = useToast();

  return (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Valor copiado ✅",
    });
  };
};