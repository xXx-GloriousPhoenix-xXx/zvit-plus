using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZvitPlus.DAL.Models.Entities
{
    public class BaseEntity
    {
        public Guid Id { get; set; } = new();
    }
}
