import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectCurrentUser, selectIsAuthenticated } from '../../store/slices/authSlice';
import { resetFilters } from '../../store/slices/filtersSlice';
import { LogOut, Compass, LayoutDashboard, MessageSquare, Repeat, LogIn, UserPlus } from 'lucide-react';
import './Header.css';
import { getImageUrl } from '../../utils/imageUtils';
import defaultProfilePic from '../../assets/images/default-profile-pic.png';

// Header component using getImageUrl for consistent profile pics

const Header = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectCurrentUser);

    const navigate = (path) => {
        history.push(path);
    };

    const handleLogout = () => {
        dispatch(logout());
        dispatch(resetFilters());
        history.push('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="main-header">
            <div className="header-content">
                <div className="header-left">
                    <img
                        src="/depth5frame02272-ifv.svg"
                        alt="Logo"
                        className="screen18-thq-depth5-frame0-elm10"
                    />
                    <div className="screen18-thq-depth4-frame1-elm1">
                        <span className="screen18-thq-text-elm10">
                            Skill Swap Platform
                        </span>
                    </div>
                </div>

                <div className="header-right">
                    {isAuthenticated ? (
                        <>
                            <div
                                className={`screen18-thq-depth4-frame1-elm2 ${isActive('/') ? 'active' : ''}`}
                                onClick={() => navigate('/')}
                                style={{ cursor: 'pointer' }}
                                title="Explore"
                            >
                                <div className="screen18-thq-depth5-frame0-elm12">
                                    <Compass size={18} />
                                    <span className="screen18-thq-text-elm12">Explore</span>
                                </div>
                            </div>

                            <div className={`screen18-thq-depth4-frame1-elm2 ${isActive('/dashboard') ? 'active' : ''}`}
                                onClick={() => navigate('/dashboard')}
                                style={{ cursor: 'pointer' }}
                                title="Dashboard"
                            >
                                <div className="screen18-thq-depth5-frame0-elm12" >
                                    <LayoutDashboard size={18} />
                                    <span className="screen18-thq-text-elm12">Dashboard</span>
                                </div>
                            </div>

                            <div className={`screen18-thq-depth4-frame1-elm2 ${isActive('/messages') ? 'active' : ''}`}
                                onClick={() => navigate('/messages')}
                                style={{ cursor: 'pointer' }}
                                title="Messages"
                            >
                                <div className="screen18-thq-depth5-frame0-elm12">
                                    <MessageSquare size={18} />
                                    <span className="screen18-thq-text-elm12">Messages</span>
                                </div>
                            </div>

                            <div className={`screen18-thq-depth4-frame1-elm2 ${isActive('/swap-requests') ? 'active' : ''}`}
                                onClick={() => navigate('/swap-requests')}
                                style={{ cursor: 'pointer' }}
                                title="Swap Requests"
                            >
                                <div className="screen18-thq-depth5-frame0-elm12">
                                    <Repeat size={18} />
                                    <span className="screen18-thq-text-elm12">Swap Requests</span>
                                </div>
                            </div>

                            <button onClick={handleLogout} className="logout-btn-refined" title="Logout">
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>

                            <div
                                className={`screen18-thq-depth4-frame2-elm1 ${isActive('/profile') ? 'active' : ''}`}
                                onClick={() => navigate('/profile')}
                                style={{
                                    cursor: 'pointer',
                                    backgroundImage: `url(${getImageUrl(user?.profile_pic_url || user?.profile_pic, defaultProfilePic)})`
                                }}
                            ></div>
                        </>
                    ) : (
                        <>
                            <div
                                className={`screen18-thq-depth4-frame1-elm2 ${isActive('/') ? 'active' : ''}`}
                                onClick={() => navigate('/')}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="screen18-thq-depth5-frame0-elm12">
                                    <Compass size={18} />
                                    <span className="screen18-thq-text-elm12">Explore</span>
                                </div>
                            </div>
                            <div
                                className={`screen18-thq-depth4-frame1-elm2 ${isActive('/login') ? 'active' : ''}`}
                                onClick={() => navigate('/login')}
                                style={{ cursor: 'pointer' }}
                                title="Login"
                            >
                                <div className="screen18-thq-depth5-frame0-elm12">
                                    <LogIn size={18} />
                                    <span className="screen18-thq-text-elm12">Login</span>
                                </div>
                            </div>
                            <div
                                className={`screen18-thq-depth4-frame1-elm2 ${isActive('/signin') ? 'active' : ''}`}
                                onClick={() => navigate('/signin')}
                                style={{ cursor: 'pointer' }}
                                title="Sign Up"
                            >
                                <div className="screen18-thq-depth5-frame0-elm12">
                                    <UserPlus size={18} />
                                    <span className="screen18-thq-text-elm12">Sign Up</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header >
    );
};

export default Header;
