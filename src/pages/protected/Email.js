import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import CreateEmail from '../../features/email/components/CreateEmail'
function InternalPage() {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setPageTitle({ title: "Email" }))
    }, [])
    return (
        <CreateEmail />
    )
}
export default InternalPage