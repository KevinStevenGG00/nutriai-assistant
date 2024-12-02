"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { dataHeaderMain } from "./HeaderMain.data";
import { useState } from "react";
import { FormAddElement } from "../FormAddElement";
import { HeaderMainProps } from "./HeaderMain.types";
import { FormAddMealPlan } from "../FormAddMealPlan";

export function HeaderMain(props: HeaderMainProps) {
  const { userId } = props;
  const [typeElement, setTypeElement] = useState<
    "password" | "mealPlan" | ""
  >();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const closeDialogAndDropdown = () => {
    setOpenDialog(false);
    setOpenDropdown(false);
  };
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl md:text-3xl font-semibold">
        {/* Todas las cajas fuertes */}
        Todos los planes nutricionales
      </h1>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
          <DropdownMenuTrigger asChild>
            <Button>
              Nuevo <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-0">
            <DropdownMenuLabel>
              <DialogTrigger asChild>
                <div className="flex flex-col">
                  {dataHeaderMain.map(({ icon: Icon, typeElement, text }) => (
                    <Button
                      key={typeElement}
                      className="justify-start"
                      variant="ghost"
                      onClick={() => setTypeElement(typeElement)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {text}
                    </Button>
                  ))}
                </div>
              </DialogTrigger>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent className="sm:max-w-[825px] max-h-[90vh] overflow-y-auto">
          {typeElement === "password" && (
            <>
              <DialogHeader>
                <DialogTitle>AÑADIR NUEVA CONTRASEÑA</DialogTitle>
              </DialogHeader>
              <FormAddElement
                userId={userId}
                closeDialog={closeDialogAndDropdown}
              />
            </>
          )}
          {typeElement === "mealPlan" && (
            <>
              <DialogHeader>
                <DialogTitle>AÑADIR NUEVO PLAN ALIMENTICIO</DialogTitle>
              </DialogHeader>
              <FormAddMealPlan
                userId={userId}
                closeDialog={closeDialogAndDropdown}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
