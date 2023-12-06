"use client";
import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useParams } from "next/navigation";
import _ from "lodash";
import ChangeName from "../settings/ChangeName";
import ChangeEmail from "../settings/ChangeEmail";
import ChangePassword from "../settings/ChangePassword";
import ChangeUserFunction from "./ChangeUserFunction";
import DeleteAccount from "../settings/DeleteAccount";

function EditUser() {
  const { id }: { id: string } = useParams();

  return (
    <Tabs defaultFocus={true} forceRenderTabPanel={true}>
      <TabList>
        <Tab>Alterar nome</Tab>
        <Tab>Alterar email</Tab>
        <Tab>Alterar senha</Tab>
        <Tab>Alterar função</Tab>
        <Tab>Deletar conta</Tab>
      </TabList>

      <TabPanel>
        <div className="max-w-sm">
          <ChangeName id={id} />
        </div>
      </TabPanel>
      <TabPanel>
        <div className="max-w-sm">
          <ChangeEmail id={id} />
        </div>
      </TabPanel>
      <TabPanel>
        <div className="max-w-sm">
          <ChangePassword id={id} />
        </div>
      </TabPanel>
      <TabPanel>
        <ChangeUserFunction id={id} />
      </TabPanel>
      <TabPanel>
        <div className="max-w-sm">
          <DeleteAccount id={id} />
        </div>
      </TabPanel>
    </Tabs>
  );
}

export default EditUser;
