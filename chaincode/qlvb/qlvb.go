package main
import(
	"encoding/json"
	"fmt"
	//"strconv"
	//"time"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)
//type Chaincode interface{
//	Init(stub *ChaincodeStubInterface)peer.Response
//	Invoke(stub *ChaincodeStubInterface)peer.Response
//	Query(stub ChaincodeStubInterface)peer.Response
//}
type qlvb struct{

}


type vanbang struct{
	maVanBang string
	tenVanBang string
	hocVi string
	soHuu SoHuu
	ngayCap string
	noiCap string
}
type SoHuu struct{
	hoTen string
	diaChi string
	sdt string
	cmnd string
}
func (v *vanbang) themSoHuu(soHuuMoi SoHuu){
	v.soHuu = soHuuMoi
}
func (t *qlvb) Init(stub shim.ChaincodeStubInterface) pb.Response {
	
	hieu := SoHuu{
		hoTen: "Le Huynh Hieu",
		diaChi: "Tra Vinh",
		sdt: "0363189900",
		cmnd: "334972375",
	}
	/*dang := SoHuu{
		hoTen: "Phan Hai Dang",
		diaChi: "Kien Giang",
		sdt: "0363189901",
		cmnd: "334972376",
	}*/
	vb1 := vanbang{
		maVanBang: "ABCD123",
		tenVanBang: "Ky Su CNTT",
		hocVi:"Ky su",
		soHuu: hieu,
		ngayCap: "01/01/2020",
		noiCap: "Dai hoc Can Tho",
	}
	/*vb2 := vanbang{
		maVanBang: "ABCE123",
		tenVanBang: "Ky Su CNTT",
		hocVi:"Ky su",
		soHuu: dang,
		ngayCap: "01/01/2020",
		noiCap: "Dai hoc Can Tho",
	}*/
	//convert hieu soHuu to []byte
	hieuAsJSONBytes,_ := json.Marshal(hieu)
	//add hieu to ledger
	err := stub.PutState(hieu.cmnd,hieuAsJSONBytes)
	if err != nil{
		return shim.Error("Failed to create asset "+hieu.hoTen)
	}
	vb1AsJSONBytes,_ := json.Marshal(vb1)
	//add vb1 to ledger
	err = stub.PutState(vb1.maVanBang,vb1AsJSONBytes)
	if err!=nil{
		return shim.Error("Failed to create asset "+vb1.maVanBang)
	}
	return shim.Success([]byte("Assets created successfully"))
}

func (t *qlvb) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	fc, args := stub.GetFunctionAndParameters()
	if fc == "TransferOwnership"{
		return t.TransferOwnership(stub,args)
	}
	return shim.Error("Called function is'nt defined in the chaincode")
}

func (t *qlvb) TransferOwnership(stub shim.ChaincodeStubInterface,args []string) pb.Response {
	//args[0]=>maVanBang
	//args[1]=>cmnd
	//read existing car asset
	vbAsBytes, _ := stub.GetState(args[0])
	if vbAsBytes ==nil{
		return shim.Error("vb asset not found")
	}
	//construct the struct vb
	vb := vanbang{}
	_ = json.Unmarshal(vbAsBytes, &vb)
	//read new soHuu details
	soHuuAsBytes, _ := stub.GetState(args[1])
	if soHuuAsBytes ==nil{
		return shim.Error("soHuu asset not found")
	}
	//construct the struct soHuu
	soHuuMoi := SoHuu{}
	_ = json.Unmarshal(soHuuAsBytes, &soHuuMoi)
	//update chu so Huu
	vb.themSoHuu(soHuuMoi)
	vbAsJSONBytes, _ := json.Marshal(vb)
	//update van bang
	err := stub.PutState(vb.maVanBang,vbAsJSONBytes)
	if err != nil{
		return shim.Error("Failed to create asset "+vb.maVanBang)
	}
	return shim.Success([]byte("Asset modified."))
}
func (t *qlvb) query (stub shim.ChaincodeStubInterface,args []string) pb.Response {
	var ENIITY string
	var err error
	if len(args)!=1{
		return shim.Error("Incorrect number of arguments. Expected ENIITY Name")
	}
	ENIITY =args[0]
	Avalbytes, err := stub.GetState(ENIITY)
	if err !=nil{
		jsonResp:= "{\"Error\":\"Failed to get state for"+ENIITY+"\"}"
		return shim.Error(jsonResp)
	}
	if Avalbytes == nil{
		jsonResp:= "{\"Error\":\"Nil order for"+ENIITY+"\"}"
		return shim.Error(jsonResp)
	}
	return shim.Success(Avalbytes)
}

func main()  {
	//logger.setLevel(shim.LogInfo)
	//Start the chaincode process
	err := shim.Start(new(qlvb))
	if err !=nil{
		fmt.Printf("Error starting - %s",err)
	}
}