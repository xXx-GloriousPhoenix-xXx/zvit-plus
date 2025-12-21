using System;
using System.Collections.Generic;
using System.Text;

namespace ZvitPlus.BLL.Services.Exceptions
{
    public class BusinessException(string message) : Exception(message);
}
