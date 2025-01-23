import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import EditTask from '../../features/projects/components/tasks/editTask'
function InternalPage() {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setPageTitle({ title: "Team Members" }))
    }, [])
    return (
        <EditTask />
    )
}
export default InternalPage