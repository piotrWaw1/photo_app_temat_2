import {FC} from "react";
import {Button} from "react-bootstrap";
import {useSessionContext} from "../../../../hooks/useSessionContext.tsx";
import {useNavigate} from "react-router-dom";

interface Member {
  username: string;
}

interface MemberOfGroupProps {
  members: Member[];
  deleteFinction: (username: string) => void;
  deleteLoading: boolean
}

const MemberOfGroup: FC<MemberOfGroupProps> = ({members, deleteFinction, deleteLoading}) => {
  const {userName} = useSessionContext()
  const nav = useNavigate()
  return (
      <>
        {members.map((user, index) => {
          if (user.username === userName) {
            return (
                <tr key={`group${index}`} className="text-center">
                  <td>{user.username}</td>
                  <td>
                    <Button
                        variant="danger"
                        onClick={() => {
                          deleteFinction(user.username)
                          nav('/groups')
                        }}
                        disabled={deleteLoading}
                    >
                      Live group
                    </Button>
                  </td>
                </tr>
            )
          }
          return (
              <tr key={`group${index}`} className="text-center">
                <td>{user.username}</td>
                <td>
                </td>
              </tr>
          )
        })

        }
      </>
  )
}

export default MemberOfGroup