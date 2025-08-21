import { useImperativeHandle} from 'react'

export default function Hud({ref}: {ref: React.Ref<any>}){

    useImperativeHandle(ref, () => {
        return {
        }
    }, [])

    
    return (
        <>
        </>
    )

}