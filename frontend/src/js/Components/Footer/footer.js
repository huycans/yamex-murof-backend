import React, { Component } from "react";

import "./footer.css";
export const Footer = () => {
  return (
    <footer>
      <div className="d-flex justify-content-around">
        <div className="p-2">
          <div className="logo">
            <img className="footer-logo logo" src={require("../../../img/logo.png")} alt="logo" />
          </div>
        </div>
        <div className="p-2 d-flex justify-content-center">
          <div className="describe-us">
            <span>YAMEX RUMOF - Team 1&#39;s project</span>
            <br />This forum help people discuss about things and things about motorcycle.
          </div>
        </div>
        <div className="p-2">

          <b>Group member :</b>
          <div className="member">
            <br /> Nguyen Thanh Binh
              <br /> Ngo Chinh Dung
              <br /> Dao Thanh Duy
              <br /> Vuong Thieu Huy
              <br /> Diep Nhut Phuong
            </div>
        </div>
      </div>
    </footer>
  );
};