import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { IUserDetails } from "../../interfaces";
import { Button, Container, Flex, Paper, Text } from "@mantine/core";
import { UsersTable } from "../../components/resturant/UsersTable";
import CommanModal from "../../components/CommanModal";
import { useState } from "react";
import InviteUserDesign from "../../components/resturant/InviteUser";
import RemoveUser from "../../components/resturant/RemoveUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import PrivatePage from "../../components/PrivatePage/PrivatePage";
import { useUser } from "../../hooks";
import { RestaurantType } from "../../interfaces/RestaurantType";
import { RestaurantLocationTable } from "../../components/resturant/RestaurantLocationTable";

export type ModalType = "inviteUser" | "empty" | "removeUser";
const ResturantManage = ({
  profiles,
  resturantDetail,
}: {
  profiles: [];
  resturantDetail: RestaurantType;
}) => {
  const { supabaseClient: supabase } = useSessionContext();
  const user = useUser();
  const [modalType, setmodalType] = useState<ModalType>("empty");
  const [selectedUser, setselectedUser] = useState<IUserDetails | null>(null);
  const [allUsers, setallUsers] = useState<IUserDetails[]>(profiles);
  const [isLoading, setisLoading] = useState(false);
  const [isUserTableSelect, setisUserTableSelect] = useState(false);
  if (user?.role !== "owner") {
    return <PrivatePage />;
  }

  const onRemove = async () => {
    if (!selectedUser || !supabase) return;
    setisLoading(true);
    // Update the user's restaurant_id to empty
    const { data, error } = await supabase
      .from("profiles")
      .update({ restaurant_id: null })
      .eq("id", selectedUser.id);
    if (error) {
      alert("Something went wrong");
      setisLoading(false);
      setmodalType("empty");
      return;
    }
    const filterList = allUsers?.filter((user) => user.id !== selectedUser.id);
    setallUsers(filterList);
    setisLoading(false);

    setmodalType("empty");
  };
  return (
    <Paper bg={"white"} mih={"100vh"}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "20px",
        }}
      >
        <Button
          color={isUserTableSelect ? "red" : "gray"}
          onClick={() => setisUserTableSelect(true)}
          mr={"10px"}
        >
          Users
        </Button>
        <Button
          color={!isUserTableSelect ? "red" : "gray"}
          onClick={() => setisUserTableSelect(false)}
        >
          Location
        </Button>
      </div>
      <Container size="xl" pt={10}>
        {isUserTableSelect ? (
          <>
            <Flex justify={"flex-end"} my={10}>
              <Button
                size="xs"
                color="orange"
                onClick={() => setmodalType("inviteUser")}
                sx={{ marginRight: "1rem" }}
              >
                Invite a user
              </Button>
            </Flex>
            <UsersTable
              setselectedUser={setselectedUser}
              data={allUsers}
              setmodalType={setmodalType}
            />
          </>
        ) : (
          <RestaurantLocationTable data={resturantDetail} />
        )}

        {
          {
            inviteUser: (
              <CommanModal
                title={"Invite a user"}
                isOpen={true}
                onClose={() => setmodalType("empty")}
              >
                <InviteUserDesign
                  restaurantName={resturantDetail?.name}
                  onClose={() => setmodalType("empty")}
                />
              </CommanModal>
            ),
            empty: <></>,
            removeUser: (
              <CommanModal
                title={"Remove a user"}
                isOpen={true}
                onClose={() => setmodalType("empty")}
              >
                <RemoveUser
                  onClose={() => setmodalType("empty")}
                  onRemove={onRemove}
                  isLoading={isLoading}
                  userEmail={selectedUser?.email}
                />
              </CommanModal>
            ),
          }[modalType]
        }
      </Container>
    </Paper>
  );
};

export default ResturantManage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  console.log("dddd", id);

  const supabase = createServerSupabaseClient(context);
  // Fetch user profiles from Supabase where id matches
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("restaurant_id", id);
  const resturantDetail = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single();
  return {
    props: {
      profiles: data,
      resturantDetail: resturantDetail?.data,
    },
  };
}
