import { useState, useEffect, useCallback } from "react";
import { IFont, ITemplate, ITemplateDetails, IUserDetails } from "../interfaces";
import { canCreateTemplate, getUser, useDialog, useUser } from "../hooks";
import {
  useSupabaseClient,
  useUser as useSupaUser,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import AuthDialog from "../components/AuthDialog";
import Editor from "../components/Editor/Editor";
import UpsertTemplateDialog from "../components/UpsertTemplateDialog";
import PrivatePage from "../components/PrivatePage/PrivatePage";
import {
  convertToLocationSectionList,
  convertToSectionList,
} from "../helpers/convertToSectionList";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { getEditorData } from "../helpers/EditorData";

export const WRAPPER_PADDING = 10;

const Template = ({
  data,
  restaurantList,
  user,
}: {
  data: ITemplateDetails;
  restaurantList: any;
  user: IUserDetails;
}) => {
  const [loader, setloader] = useState(false);

  if (typeof window !== "undefined") {
    if (!canCreateTemplate(user)) {
      return <PrivatePage login={!user} />;
    }

    return (
      <>
        <Editor template={data} loader={loader} setloader={setloader} restaurantList={restaurantList} user={user} />
      </>
    );
  }

  return null;
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await getEditorData(context);
}
export default Template;
