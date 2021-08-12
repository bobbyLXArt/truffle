import { handleRequest } from "../../utils/utils";
import { Request } from "../../utils/types";
import Button from "../common/Button";
import Card from "../common/Card";

interface Props {
  request: Request;
  setRequests: (requests: Request[] | ((requests: Request[]) => Request[])) => void;
  provider: any;
  socket: WebSocket;
}

function IncomingRequest({ provider, socket, request, setRequests }: Props) {
  const removeFromRequests = (id: number) => {
    setRequests((previousRequests) => previousRequests.filter(request => request.id !== id));
  };

  const process = async () => {
    await handleRequest(request, provider, socket);
    removeFromRequests(request.id);
  };

  return (
    <div key={request.id} className="flex justify-center items-center">
      <Card
        header={request.payload.method}
        body={
          <div>
            {JSON.stringify(request.payload.params)}
          </div>
        }
        footer={
          <div className="flex justify-center items-center">
            <Button onClick={process} text="PROCESS" />
          </div>
        }
      />
    </div>
  );
}

export default IncomingRequest;