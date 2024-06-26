import {FC} from "react";
import {useSessionContext} from "../../../../hooks/useSessionContext.tsx";
import {Button} from "react-bootstrap";


interface Member {
  username: string;
}
interface OwnerOfGroupProps {
  members: Member[];
  deleteFinction: (username: string) => void;
  deleteLoading: boolean
}

const OwnerOfGroup: FC<OwnerOfGroupProps> = ({members, deleteFinction, deleteLoading}) => {
  const {userName} = useSessionContext()

  return (
      <>
        {members.map((user, index) => {
          if (members.length === 1) {
            return (
                <tr key={`group${index}`} className="text-center">
                  <td colSpan={2}>No members</td>
                </tr>
            )
          }
          if (user.username === userName) {
            return null
          }
          return (
              <tr key={`group${index}`} className="text-center">
                <td>{user.username}</td>
                <td>
                  <Button
                      variant="danger"
                      onClick={() => deleteFinction(user.username)}
                      disabled={deleteLoading}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
          )
        })}
      </>
  )
}

export default OwnerOfGroup