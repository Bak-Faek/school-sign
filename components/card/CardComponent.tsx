"use client";

// component
import { CardElProps } from "@/components/card/cardTypes";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderIcon } from "@/components/icons/FolderIcon";
import { Pencil1Icon } from "@radix-ui/react-icons";

export default function CardComponent({ elements }: CardElProps) {
  return (
    <>
      {elements.map((element, index) => (
        <Card key={index} className="cursor-pointer max-w-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <FolderIcon className="w-8" />
            <CardTitle className="text-md font-normal">
              {element.name}
            </CardTitle>
            <Pencil1Icon />
          </CardHeader>
        </Card>
      ))}
    </>
  );
}
