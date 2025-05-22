public class HomeModel
{
    public string Title { get; set; }
    public string Description { get; set; }
    public List<string> Features { get; set; }

    public HomeModel()
    {
        Features = new List<string>();
    }
}