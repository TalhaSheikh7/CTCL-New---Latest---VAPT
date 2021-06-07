using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace CTCLProj.Class
{
    public class EncryptDecrypt
    {
        public static string EncryptString(string toEncrypt, bool useHashing)
        {
            var base64EncodedText = Convert.ToBase64String(Encoding.UTF8.GetBytes(toEncrypt));
            return base64EncodedText;

        }
        public static string DecryptString(string cipherString, bool useHashing)

        {
            var base64EncodedBytes = System.Convert.FromBase64String(cipherString);
            var strModified = System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
            return strModified;
        }
    }
}