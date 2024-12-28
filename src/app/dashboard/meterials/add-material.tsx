"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export type Meterial = {
  id?: string;
  name: string;
  description: string;
  status?: string;
};
interface AddMeterialProps {
  meterial?: Meterial;
  onChange: (data: Meterial) => void;
}

export function AddMeterial({ meterial, onChange }: AddMeterialProps) {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.nameMaterial.value;
    const description = form.description.value;

    onChange({
      id: "1",
      name,
      description,
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Create</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add meterial</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="nameMaterial">Name</Label>
                <Input id="nameMaterial" type="text" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="description">Description</Label>
                </div>
                <Textarea
                  id="description"
                  placeholder="Type your message here."
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
              <Button className="bg-white text-black border">Cancel</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
