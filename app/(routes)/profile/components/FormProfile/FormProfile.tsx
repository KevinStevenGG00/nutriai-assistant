"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { FormProfileProps } from "./FormProfile.types";
import { formSchema } from "./FormProfile.form";
import Image from "next/image";
import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export function FormProfile(props: FormProfileProps) {
  const { user } = props;
  const router = useRouter();
  const [showUploadPhoto, setShowUploadPhoto] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      profileImage: user.profileImage || "",
      username: user.username || "",
      id: user.id,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch("/api/profile", values);
      toast({
        title: "Profile updated ✅",
      });
      router.refresh();
      setShowUploadPhoto(false);
      setPhotoUploaded(false);
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="profileImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <FormControl>
                  <div>
                    <div className="flex gap-2 items-center">
                      <Image
                        src={
                          user.profileImage
                            ? user.profileImage
                            : "/images/default-profile.png"
                        }
                        alt="Image profile"
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div className="w-[200px]">
                        {showUploadPhoto ? (
                          <UploadButton
                            className="rounded-md text-slate-800 bg-slate-200 mt-3"
                            {...field}
                            endpoint="profileImage"
                            onClientUploadComplete={(res) => {
                              form.setValue("profileImage", res?.[0].url);
                              setPhotoUploaded(true);
                            }}
                            onUploadError={(error: Error) => {
                              console.log(error);
                            }}
                          />
                        ) : (
                          <Button
                            onClick={() => setShowUploadPhoto((prev) => !prev)}
                          >
                            <Upload className="mr-2 w-4 h-4" /> Change photo
                          </Button>
                        )}
                      </div>
                    </div>
                    {photoUploaded && (
                      <p className="text-sm">Image uploaded!</p>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </div>
  );
}
