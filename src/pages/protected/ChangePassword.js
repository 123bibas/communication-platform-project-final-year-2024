import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ChangePassword from '../../features/settings/passwordSettings/index'
function InternalPage() {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setPageTitle({ title: "Settings" }))
    }, [])
    return (
        <ChangePassword />
    )
}
export default InternalPage