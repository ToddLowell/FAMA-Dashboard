declare module 'ldap-authentication' {
  interface Options {
    ldapOpts: {
      url: string;
    };
    adminDn: string;
    adminPassword: string;
    username: any;
    userPassword: any;
    userSearchBase: string;
    usernameAttribute: string;
  }

  // sample Response
  interface Response {
    dn: string;
    controls: string[];
    accountStatus: string | number;
    displayName: string;
    employeeNumber: string;
    famaPersonICNumber: string;
    gidNumber: string | number;
    homeDirectory: string;
    homePostalAddress: string;
    l: string;
    loginShell: string;
    mailHost: string;
    mailMessageStore: string;
    mailQuotaSize: string | number;
    mobile: string;
    objectClass: string[];
    qmailDotMode: string | number;
    qmailGID: string | number;
    qmailUID: string | number;
    uidNumber: string | number;
    uid: string;
    userPassword: string;
    sn: string;
    givenName: string;
    mail: string;
    cn: string;
  }

  export function authenticate(options: Options): Response;
}
