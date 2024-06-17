import ManageGroups from "./groupComponents/ManageGroups.tsx";
import ManageImages from "./groupComponents/ManageImages.tsx";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import {useSessionContext} from "../../hooks/useSessionContext.tsx";

interface Member {
  username: string;
}

interface GroupData {
  id: number;
  members: Member[];
  name: string;
  owner: string;
}

export default function Group() {
  const {id} = useParams()
  const {tokens} = useSessionContext()
  const [groupData, setGroupData] = useState<GroupData>()
  const [loading, setLoading] = useState(false)

  const groupMembers = useCallback(async () => {
    try {
      setLoading(true)
      const {data} = await axios.get<GroupData>(`/annotations/groups/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(tokens?.access),
            }
          }
      )
      setGroupData(data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
      }
    } finally {
      setLoading(false)
    }
  }, [id, tokens?.access])

  useEffect(() => {
    groupMembers().then()
  }, [groupMembers, id]);

  return (
      <>
        <h1 className="border-bottom pb-3 text-center">{groupData?.name}</h1>
        <ManageGroups data={groupData?.members || []} loading={loading} update={groupMembers}/>
        <ManageImages/>
      </>
  )
}