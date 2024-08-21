import React,{useState, useEffect, useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Accordion, Spinner} from 'react-bootstrap'
import { ThemeContext } from '../../../context/ThemeContext'
import PerfectScrollbar from "react-perfect-scrollbar"
import { baseURL_ } from '../../../config'
import { toast } from 'react-toastify';
import { Logout } from '../../../store/actions/AuthActions';
import axiosInstance from '../../../services/AxiosInstance';
import { useDispatch } from 'react-redux'

const Mines = () => {
    const navigate = useNavigate()
	const dispatch = useDispatch()
	const { changeTitle } = useContext(ThemeContext);
    const [suppliers, setsuppliers] = useState([])
    const [loading, setloading] = useState(true)
    const [mines, setmines] = useState([])
    const [init, setinit] = useState()
    const [filtered, setfiltered] = useState([])
    const apiHeaders = {
        'authorization': `Bearer ${localStorage.getItem('_authTkn')}`,
        'x-refresh': localStorage.getItem(`_authRfrsh`)
    }

    const fetch = async()=>{
        try{
            let response = await axiosInstance.get(`${baseURL_}companies`, { headers: apiHeaders })
            let response_ = await axiosInstance.get(`${baseURL_}mines`, { headers: apiHeaders })
            setinit(response.data.companies[0].id)
            setsuppliers(response.data.companies)
            setfiltered(response.data.companies)
            setmines(response_.data.mines)
            setloading(false)
        }catch(err){
            setloading(false)
            try{
				if(err.response.code === 403){
					dispatch(Logout(navigate))
				}else{
					toast.warn(err.response.message)
				}
			}catch(e){
				toast.error(err.message)
			}
        }
    }

    useEffect(() => {
        fetch()
		changeTitle(`Mines | Minexx`)
    }, []);

    const filter = e => {
        let input = e.currentTarget.value
        setfiltered(suppliers.filter(site=>{
            return site.name.toLowerCase().includes(input.toLowerCase())
        }))
    }
   
    return (
        <>
            <div className="row page-titles">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active"><Link to={"/overview"}> Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link to={""}> Mines</Link></li>
                </ol>
            </div>
            <div className="row">
                <div className="col-xl-12 col-xxl-12">
                    <div className="card">
                        <div className='card-header'>
                            <h4 className='card-title'>Mines</h4>
                            <div className='col-md-3'>
                                <input className='form-control' placeholder='Search' onChange={filter}/>
                            </div>
                        </div>
                        <div className='card-body'>
                            { loading ? <center><Spinner size="md" style={{ margin: 25 }} role="status" variant="primary"><span className="visually-hidden">Loading...</span></Spinner></center> :
                            <PerfectScrollbar className="card-body dz-scroll" style={{ overflow: 'hidden' }}>
                                <Accordion className="accordion accordion-rounded-stylish accordion-bordered mt-2" defaultActiveKey={init}>
                                    { filtered.map((supplier, index) =>{
                                        return (<Accordion.Item className="accordion-item" key={supplier?.id} eventKey={supplier?.id}>
                                            <Accordion.Header className="accordion-header rounded-lg">
                                                <span className='text-primary'>{supplier?.name}</span>
                                                &emsp;<span className='badge badge-primary'>{mines.filter(single=>single.company === supplier.id).length}</span>
                                            </Accordion.Header>
                                            <Accordion.Collapse id={supplier?.id} eventKey={supplier?.id}>
                                                <div className="accordion-body">
                                                    { mines.filter(single=>single.company === supplier.id).length === 0 ? <div className='pa-5 text-center'>There are no mine sites associted with {supplier.name}</div>
                                                    : mines.filter(single=>single.company === supplier.id).map(mine=><p className='mt-2 mb-2' key={mine.id}><Link className='text-warning' to={`/mines/${mine.id}`}>{mine.name}</Link><br/></p>)}
                                                </div>
                                            </Accordion.Collapse>
                                        </Accordion.Item>) }
                                    )}
                                </Accordion>                            
                            </PerfectScrollbar>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


export default Mines;