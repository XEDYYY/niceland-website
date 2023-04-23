import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Footer = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        // <div className={`bg-footer`}>
        <div className={`footer inherit-grid bg-footer`}>
            <div className="top-row"></div>
            <div className="links inherit-grid font-footer-links">

                <div className="s1">
                    <div className="item title">Niceland</div>
                    <div className="item">
                        <Link to={"/features"}>
                            Features
                        </Link>
                    </div>
                    <div className="item">
                        <Link to={"/about"}>
                            About
                        </Link>
                    </div>
                    <div className="item">
                        <Link to={"/download"}>
                            Downloads
                        </Link>
                    </div>
                    <div className="item">
                        <Link to={"/support"}>
                            Support
                        </Link>
                    </div>
                    <div className="item">
                        <Link to={"/beta"}>
                            Beta
                        </Link>
                    </div>
                </div>

                <div className="s2">
                    <div className="item title">Policies</div>
                    <div className="item">
                        <Link to={"/policies"}>
                            Privacy
                        </Link>
                    </div>
                </div>

                <div className="s3">
                    <div className="item title">Support</div>
                    <div className="item">support@nicelandvpn.is</div>
                    <div className="item">
                        <a href="https://join.slack.com/t/nicelandvpn/shared_invite/zt-1no4cjdjr-zv7JAbUhqL4cq0MSW1jPBQ" target={"_blank"}>Slack</a>
                    </div>
                    <div className="item">
                        <a href="https://discord.gg/7Ts3PCnCd9" target={"_blank"}>Discord</a>
                    </div>
                    <div className="item">
                        <a href="https://www.reddit.com/r/nicelandvpn" target={"_blank"}>Reddit</a>
                    </div>
                    <div className="item">
                        <a href="https://www.twitter.com/nicelandvpn" target={"_blank"}>Twitter</a>
                    </div>
                </div>

                <div className="s4">
                    <div className="item title">Contact</div>
                    <div className="item">Tunnels EHF</div>
                    <div className="item">SSN. 4209221080</div>
                    <div className="item">VAT. No. 148343</div>
                    <div className="item">Borgartún 25</div>
                    <div className="item">105 Reykjavík</div>
                    <div className="item">Iceland</div>
                </div>


            </div>
            <div className="bottom-row font-footer-links">
                © 2023 NicelandVPN. All rights reserved.<br />
                <a className="icons8" href="https://icons8.com/">Icons provided by Icons8</a>
            </div>
        </div>
    )
}

export default Footer;