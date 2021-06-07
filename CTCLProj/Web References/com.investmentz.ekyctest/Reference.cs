﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// 
// This source code was auto-generated by Microsoft.VSDesigner, Version 4.0.30319.42000.
// 
#pragma warning disable 1591

namespace CTCLProj.com.investmentz.ekyctest {
    using System;
    using System.Web.Services;
    using System.Diagnostics;
    using System.Web.Services.Protocols;
    using System.Xml.Serialization;
    using System.ComponentModel;
    
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Web.Services.WebServiceBindingAttribute(Name="BasicHttpBinding_IAuthenticateService", Namespace="http://tempuri.org/")]
    public partial class AuthenticateService : System.Web.Services.Protocols.SoapHttpClientProtocol {
        
        private System.Threading.SendOrPostCallback LoginAuthenticateOperationCompleted;
        
        private System.Threading.SendOrPostCallback ChangePasswordOperationCompleted;
        
        private System.Threading.SendOrPostCallback ChangeUserIdOperationCompleted;
        
        private System.Threading.SendOrPostCallback SessionManageOperationCompleted;
        
        private System.Threading.SendOrPostCallback ValidateMPINOperationCompleted;
        
        private System.Threading.SendOrPostCallback CreateLoginIdOperationCompleted;
        
        private System.Threading.SendOrPostCallback GetSMSOTPOperationCompleted;
        
        private System.Threading.SendOrPostCallback GetSessionLogOperationCompleted;
        
        private bool useDefaultCredentialsSetExplicitly;
        
        /// <remarks/>
        public AuthenticateService() {
            this.Url = global::CTCLProj.Properties.Settings.Default.CTCLProj_com_investmentz_ekyctest_AuthenticateService;
            if ((this.IsLocalFileSystemWebService(this.Url) == true)) {
                this.UseDefaultCredentials = true;
                this.useDefaultCredentialsSetExplicitly = false;
            }
            else {
                this.useDefaultCredentialsSetExplicitly = true;
            }
        }
        
        public new string Url {
            get {
                return base.Url;
            }
            set {
                if ((((this.IsLocalFileSystemWebService(base.Url) == true) 
                            && (this.useDefaultCredentialsSetExplicitly == false)) 
                            && (this.IsLocalFileSystemWebService(value) == false))) {
                    base.UseDefaultCredentials = false;
                }
                base.Url = value;
            }
        }
        
        public new bool UseDefaultCredentials {
            get {
                return base.UseDefaultCredentials;
            }
            set {
                base.UseDefaultCredentials = value;
                this.useDefaultCredentialsSetExplicitly = true;
            }
        }
        
        /// <remarks/>
        public event LoginAuthenticateCompletedEventHandler LoginAuthenticateCompleted;
        
        /// <remarks/>
        public event ChangePasswordCompletedEventHandler ChangePasswordCompleted;
        
        /// <remarks/>
        public event ChangeUserIdCompletedEventHandler ChangeUserIdCompleted;
        
        /// <remarks/>
        public event SessionManageCompletedEventHandler SessionManageCompleted;
        
        /// <remarks/>
        public event ValidateMPINCompletedEventHandler ValidateMPINCompleted;
        
        /// <remarks/>
        public event CreateLoginIdCompletedEventHandler CreateLoginIdCompleted;
        
        /// <remarks/>
        public event GetSMSOTPCompletedEventHandler GetSMSOTPCompleted;
        
        /// <remarks/>
        public event GetSessionLogCompletedEventHandler GetSessionLogCompleted;
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/IAuthenticateService/LoginAuthenticate", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        [return: System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public AuthResponse LoginAuthenticate([System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string UserId, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string Password, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string IP, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string ProductID, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string Browser) {
            object[] results = this.Invoke("LoginAuthenticate", new object[] {
                        UserId,
                        Password,
                        IP,
                        ProductID,
                        Browser});
            return ((AuthResponse)(results[0]));
        }
        
        /// <remarks/>
        public void LoginAuthenticateAsync(string UserId, string Password, string IP, string ProductID, string Browser) {
            this.LoginAuthenticateAsync(UserId, Password, IP, ProductID, Browser, null);
        }
        
        /// <remarks/>
        public void LoginAuthenticateAsync(string UserId, string Password, string IP, string ProductID, string Browser, object userState) {
            if ((this.LoginAuthenticateOperationCompleted == null)) {
                this.LoginAuthenticateOperationCompleted = new System.Threading.SendOrPostCallback(this.OnLoginAuthenticateOperationCompleted);
            }
            this.InvokeAsync("LoginAuthenticate", new object[] {
                        UserId,
                        Password,
                        IP,
                        ProductID,
                        Browser}, this.LoginAuthenticateOperationCompleted, userState);
        }
        
        private void OnLoginAuthenticateOperationCompleted(object arg) {
            if ((this.LoginAuthenticateCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.LoginAuthenticateCompleted(this, new LoginAuthenticateCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/IAuthenticateService/ChangePassword", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        [return: System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public AuthResponse ChangePassword([System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string EventName, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string UserId, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string OldPassword, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string NewPassword) {
            object[] results = this.Invoke("ChangePassword", new object[] {
                        EventName,
                        UserId,
                        OldPassword,
                        NewPassword});
            return ((AuthResponse)(results[0]));
        }
        
        /// <remarks/>
        public void ChangePasswordAsync(string EventName, string UserId, string OldPassword, string NewPassword) {
            this.ChangePasswordAsync(EventName, UserId, OldPassword, NewPassword, null);
        }
        
        /// <remarks/>
        public void ChangePasswordAsync(string EventName, string UserId, string OldPassword, string NewPassword, object userState) {
            if ((this.ChangePasswordOperationCompleted == null)) {
                this.ChangePasswordOperationCompleted = new System.Threading.SendOrPostCallback(this.OnChangePasswordOperationCompleted);
            }
            this.InvokeAsync("ChangePassword", new object[] {
                        EventName,
                        UserId,
                        OldPassword,
                        NewPassword}, this.ChangePasswordOperationCompleted, userState);
        }
        
        private void OnChangePasswordOperationCompleted(object arg) {
            if ((this.ChangePasswordCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.ChangePasswordCompleted(this, new ChangePasswordCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/IAuthenticateService/ChangeUserId", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        [return: System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public AuthResponse ChangeUserId([System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string UserId, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string Password, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string NewUserId) {
            object[] results = this.Invoke("ChangeUserId", new object[] {
                        UserId,
                        Password,
                        NewUserId});
            return ((AuthResponse)(results[0]));
        }
        
        /// <remarks/>
        public void ChangeUserIdAsync(string UserId, string Password, string NewUserId) {
            this.ChangeUserIdAsync(UserId, Password, NewUserId, null);
        }
        
        /// <remarks/>
        public void ChangeUserIdAsync(string UserId, string Password, string NewUserId, object userState) {
            if ((this.ChangeUserIdOperationCompleted == null)) {
                this.ChangeUserIdOperationCompleted = new System.Threading.SendOrPostCallback(this.OnChangeUserIdOperationCompleted);
            }
            this.InvokeAsync("ChangeUserId", new object[] {
                        UserId,
                        Password,
                        NewUserId}, this.ChangeUserIdOperationCompleted, userState);
        }
        
        private void OnChangeUserIdOperationCompleted(object arg) {
            if ((this.ChangeUserIdCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.ChangeUserIdCompleted(this, new ChangeUserIdCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/IAuthenticateService/SessionManage", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        [return: System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public AuthResponse SessionManage([System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string LoginId, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string SessionId, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string ProductID, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string BrowserInfo, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string DeviceInfo, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string IPAdd, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string SType) {
            object[] results = this.Invoke("SessionManage", new object[] {
                        LoginId,
                        SessionId,
                        ProductID,
                        BrowserInfo,
                        DeviceInfo,
                        IPAdd,
                        SType});
            return ((AuthResponse)(results[0]));
        }
        
        /// <remarks/>
        public void SessionManageAsync(string LoginId, string SessionId, string ProductID, string BrowserInfo, string DeviceInfo, string IPAdd, string SType) {
            this.SessionManageAsync(LoginId, SessionId, ProductID, BrowserInfo, DeviceInfo, IPAdd, SType, null);
        }
        
        /// <remarks/>
        public void SessionManageAsync(string LoginId, string SessionId, string ProductID, string BrowserInfo, string DeviceInfo, string IPAdd, string SType, object userState) {
            if ((this.SessionManageOperationCompleted == null)) {
                this.SessionManageOperationCompleted = new System.Threading.SendOrPostCallback(this.OnSessionManageOperationCompleted);
            }
            this.InvokeAsync("SessionManage", new object[] {
                        LoginId,
                        SessionId,
                        ProductID,
                        BrowserInfo,
                        DeviceInfo,
                        IPAdd,
                        SType}, this.SessionManageOperationCompleted, userState);
        }
        
        private void OnSessionManageOperationCompleted(object arg) {
            if ((this.SessionManageCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.SessionManageCompleted(this, new SessionManageCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/IAuthenticateService/ValidateMPIN", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        [return: System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public AuthResponse ValidateMPIN([System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string LoginId, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string MPIN, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string Type) {
            object[] results = this.Invoke("ValidateMPIN", new object[] {
                        LoginId,
                        MPIN,
                        Type});
            return ((AuthResponse)(results[0]));
        }
        
        /// <remarks/>
        public void ValidateMPINAsync(string LoginId, string MPIN, string Type) {
            this.ValidateMPINAsync(LoginId, MPIN, Type, null);
        }
        
        /// <remarks/>
        public void ValidateMPINAsync(string LoginId, string MPIN, string Type, object userState) {
            if ((this.ValidateMPINOperationCompleted == null)) {
                this.ValidateMPINOperationCompleted = new System.Threading.SendOrPostCallback(this.OnValidateMPINOperationCompleted);
            }
            this.InvokeAsync("ValidateMPIN", new object[] {
                        LoginId,
                        MPIN,
                        Type}, this.ValidateMPINOperationCompleted, userState);
        }
        
        private void OnValidateMPINOperationCompleted(object arg) {
            if ((this.ValidateMPINCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.ValidateMPINCompleted(this, new ValidateMPINCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/IAuthenticateService/CreateLoginId", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        [return: System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public AuthResponse CreateLoginId([System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string CommonClientCode, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string LoginId, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string Password, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string MPIN, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string UType) {
            object[] results = this.Invoke("CreateLoginId", new object[] {
                        CommonClientCode,
                        LoginId,
                        Password,
                        MPIN,
                        UType});
            return ((AuthResponse)(results[0]));
        }
        
        /// <remarks/>
        public void CreateLoginIdAsync(string CommonClientCode, string LoginId, string Password, string MPIN, string UType) {
            this.CreateLoginIdAsync(CommonClientCode, LoginId, Password, MPIN, UType, null);
        }
        
        /// <remarks/>
        public void CreateLoginIdAsync(string CommonClientCode, string LoginId, string Password, string MPIN, string UType, object userState) {
            if ((this.CreateLoginIdOperationCompleted == null)) {
                this.CreateLoginIdOperationCompleted = new System.Threading.SendOrPostCallback(this.OnCreateLoginIdOperationCompleted);
            }
            this.InvokeAsync("CreateLoginId", new object[] {
                        CommonClientCode,
                        LoginId,
                        Password,
                        MPIN,
                        UType}, this.CreateLoginIdOperationCompleted, userState);
        }
        
        private void OnCreateLoginIdOperationCompleted(object arg) {
            if ((this.CreateLoginIdCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.CreateLoginIdCompleted(this, new CreateLoginIdCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/IAuthenticateService/GetSMSOTP", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        [return: System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public AuthResponse GetSMSOTP([System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string MobileNumber) {
            object[] results = this.Invoke("GetSMSOTP", new object[] {
                        MobileNumber});
            return ((AuthResponse)(results[0]));
        }
        
        /// <remarks/>
        public void GetSMSOTPAsync(string MobileNumber) {
            this.GetSMSOTPAsync(MobileNumber, null);
        }
        
        /// <remarks/>
        public void GetSMSOTPAsync(string MobileNumber, object userState) {
            if ((this.GetSMSOTPOperationCompleted == null)) {
                this.GetSMSOTPOperationCompleted = new System.Threading.SendOrPostCallback(this.OnGetSMSOTPOperationCompleted);
            }
            this.InvokeAsync("GetSMSOTP", new object[] {
                        MobileNumber}, this.GetSMSOTPOperationCompleted, userState);
        }
        
        private void OnGetSMSOTPOperationCompleted(object arg) {
            if ((this.GetSMSOTPCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.GetSMSOTPCompleted(this, new GetSMSOTPCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        [System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/IAuthenticateService/GetSessionLog", RequestNamespace="http://tempuri.org/", ResponseNamespace="http://tempuri.org/", Use=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)]
        [return: System.Xml.Serialization.XmlArrayAttribute(IsNullable=true)]
        [return: System.Xml.Serialization.XmlArrayItemAttribute(Namespace="http://schemas.datacontract.org/2004/07/KYCReqRespAPI.Models")]
        public SessionInfo[] GetSessionLog([System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string FromDate, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string ToDate, [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)] string LoginId) {
            object[] results = this.Invoke("GetSessionLog", new object[] {
                        FromDate,
                        ToDate,
                        LoginId});
            return ((SessionInfo[])(results[0]));
        }
        
        /// <remarks/>
        public void GetSessionLogAsync(string FromDate, string ToDate, string LoginId) {
            this.GetSessionLogAsync(FromDate, ToDate, LoginId, null);
        }
        
        /// <remarks/>
        public void GetSessionLogAsync(string FromDate, string ToDate, string LoginId, object userState) {
            if ((this.GetSessionLogOperationCompleted == null)) {
                this.GetSessionLogOperationCompleted = new System.Threading.SendOrPostCallback(this.OnGetSessionLogOperationCompleted);
            }
            this.InvokeAsync("GetSessionLog", new object[] {
                        FromDate,
                        ToDate,
                        LoginId}, this.GetSessionLogOperationCompleted, userState);
        }
        
        private void OnGetSessionLogOperationCompleted(object arg) {
            if ((this.GetSessionLogCompleted != null)) {
                System.Web.Services.Protocols.InvokeCompletedEventArgs invokeArgs = ((System.Web.Services.Protocols.InvokeCompletedEventArgs)(arg));
                this.GetSessionLogCompleted(this, new GetSessionLogCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState));
            }
        }
        
        /// <remarks/>
        public new void CancelAsync(object userState) {
            base.CancelAsync(userState);
        }
        
        private bool IsLocalFileSystemWebService(string url) {
            if (((url == null) 
                        || (url == string.Empty))) {
                return false;
            }
            System.Uri wsUri = new System.Uri(url);
            if (((wsUri.Port >= 1024) 
                        && (string.Compare(wsUri.Host, "localHost", System.StringComparison.OrdinalIgnoreCase) == 0))) {
                return true;
            }
            return false;
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.8.4084.0")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://schemas.datacontract.org/2004/07/KYCReqRespAPI.Models")]
    public partial class AuthResponse {
        
        private string respCodeField;
        
        private string respMessageField;
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public string RespCode {
            get {
                return this.respCodeField;
            }
            set {
                this.respCodeField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public string RespMessage {
            get {
                return this.respMessageField;
            }
            set {
                this.respMessageField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.8.4084.0")]
    [System.SerializableAttribute()]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    [System.Xml.Serialization.XmlTypeAttribute(Namespace="http://schemas.datacontract.org/2004/07/KYCReqRespAPI.Models")]
    public partial class SessionInfo {
        
        private string browserInfoField;
        
        private string clientNameField;
        
        private string deviceInfoField;
        
        private string iPAddressField;
        
        private string loginIDField;
        
        private string sessionEndField;
        
        private string sessionIDField;
        
        private string sessionStartField;
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public string BrowserInfo {
            get {
                return this.browserInfoField;
            }
            set {
                this.browserInfoField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public string ClientName {
            get {
                return this.clientNameField;
            }
            set {
                this.clientNameField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public string DeviceInfo {
            get {
                return this.deviceInfoField;
            }
            set {
                this.deviceInfoField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public string IPAddress {
            get {
                return this.iPAddressField;
            }
            set {
                this.iPAddressField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public string LoginID {
            get {
                return this.loginIDField;
            }
            set {
                this.loginIDField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public string SessionEnd {
            get {
                return this.sessionEndField;
            }
            set {
                this.sessionEndField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public string SessionID {
            get {
                return this.sessionIDField;
            }
            set {
                this.sessionIDField = value;
            }
        }
        
        /// <remarks/>
        [System.Xml.Serialization.XmlElementAttribute(IsNullable=true)]
        public string SessionStart {
            get {
                return this.sessionStartField;
            }
            set {
                this.sessionStartField = value;
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    public delegate void LoginAuthenticateCompletedEventHandler(object sender, LoginAuthenticateCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class LoginAuthenticateCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal LoginAuthenticateCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public AuthResponse Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((AuthResponse)(this.results[0]));
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    public delegate void ChangePasswordCompletedEventHandler(object sender, ChangePasswordCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class ChangePasswordCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal ChangePasswordCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public AuthResponse Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((AuthResponse)(this.results[0]));
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    public delegate void ChangeUserIdCompletedEventHandler(object sender, ChangeUserIdCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class ChangeUserIdCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal ChangeUserIdCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public AuthResponse Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((AuthResponse)(this.results[0]));
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    public delegate void SessionManageCompletedEventHandler(object sender, SessionManageCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class SessionManageCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal SessionManageCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public AuthResponse Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((AuthResponse)(this.results[0]));
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    public delegate void ValidateMPINCompletedEventHandler(object sender, ValidateMPINCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class ValidateMPINCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal ValidateMPINCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public AuthResponse Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((AuthResponse)(this.results[0]));
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    public delegate void CreateLoginIdCompletedEventHandler(object sender, CreateLoginIdCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class CreateLoginIdCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal CreateLoginIdCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public AuthResponse Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((AuthResponse)(this.results[0]));
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    public delegate void GetSMSOTPCompletedEventHandler(object sender, GetSMSOTPCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class GetSMSOTPCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal GetSMSOTPCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public AuthResponse Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((AuthResponse)(this.results[0]));
            }
        }
    }
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    public delegate void GetSessionLogCompletedEventHandler(object sender, GetSessionLogCompletedEventArgs e);
    
    /// <remarks/>
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.8.4084.0")]
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.ComponentModel.DesignerCategoryAttribute("code")]
    public partial class GetSessionLogCompletedEventArgs : System.ComponentModel.AsyncCompletedEventArgs {
        
        private object[] results;
        
        internal GetSessionLogCompletedEventArgs(object[] results, System.Exception exception, bool cancelled, object userState) : 
                base(exception, cancelled, userState) {
            this.results = results;
        }
        
        /// <remarks/>
        public SessionInfo[] Result {
            get {
                this.RaiseExceptionIfNecessary();
                return ((SessionInfo[])(this.results[0]));
            }
        }
    }
}

#pragma warning restore 1591