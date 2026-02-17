import {useEffect} from 'react';
import {  getESignStatus ,UseUpdateRemarks} from '../axios';
import { useAppDispatch } from '../redux/hooks';
import { useRouter } from 'next/router';
import {  Loading, ShowMessagePopup } from '../GenericFunctions';

const CheckEsignStatus = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();


    useEffect(
        () => {
        (async() => {
            let data:any = localStorage.getItem('EsignData');
            let remaksData:any = localStorage.getItem("remarksData");
        if(data){
            data = JSON.parse(data);
            const statusEsignData ={
                "id": data.id,
                "txnId": String(data.txnid),
                "action":data.action
            }
            Loading(true);
            // let ar = CheckStorageData(["SelectedPendingEsign"]);
            let result:any = await getESignStatus(statusEsignData) 
            if(!result.status){
                ShowMessagePopup(false, "Esign failed", '');
            } else {
                let remaksData = localStorage.getItem("remarksData");
                await UpdateRemarks(remaksData)
                ShowMessagePopup(true, 'Esign completed', '');
            }
            Loading(false);
            setTimeout(() => {
                router.push('/firms');
            }, 0)
        } else {
            router.push('/firms');
        }
        localStorage.removeItem('esignData');
        })()
        
    }, 
    [])

    const UpdateRemarks = async (data:any)=>{
        let obj:any ={
            remark : data
        }
        await UseUpdateRemarks(obj);
    }

    return <>Loading...</>
}

export default CheckEsignStatus;


