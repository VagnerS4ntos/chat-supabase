"use client";
import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ChangeName from "@/components/settings/ChangeName";
import ChangeEmail from "@/components/settings/ChangeEmail";
import ChangePassword from "@/components/settings/ChangePassword";
import DeleteAccount from "@/components/settings/DeleteAccount";
import { supabase } from "@/supabase/client";
import { useUsers } from "@/states/GlobalStates";
import { userT } from "@/typescript/types";
import { toast } from "react-toastify";

function Settings() {
  const { getCurrentUser, getAllUsers } = useUsers((state) => state);

  React.useEffect(() => {
    const usersChanel = supabase
      .channel("usersChanel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          getCurrentUser(payload.new as userT);
          supabase
            .from("users")
            .select()
            .order("name", { ascending: true })
            .returns<userT[]>()
            .then(({ data, error }) => {
              if (!error) {
                getAllUsers(data);
              } else {
                toast.error(error.message);
              }
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(usersChanel);
    };
  }, []);

  return (
    <main className="container my-4">
      <Tabs
        defaultFocus={true}
        forceRenderTabPanel={true}
        className="w-fit mx-auto"
      >
        <TabList className="uppercase text-center border-b">
          <Tab>Alterar nome</Tab>
          <Tab>Alterar email</Tab>
          <Tab>Alterar senha</Tab>
          <Tab>Deletar conta</Tab>
        </TabList>

        <TabPanel>
          <ChangeName />
        </TabPanel>
        <TabPanel>
          <ChangeEmail />
        </TabPanel>
        <TabPanel>
          <ChangePassword />
        </TabPanel>
        <TabPanel>
          <DeleteAccount />
        </TabPanel>
      </Tabs>
    </main>
  );
}

export default Settings;
