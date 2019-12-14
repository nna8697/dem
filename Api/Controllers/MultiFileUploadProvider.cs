namespace Api.Controllers
{
    internal class MultiFileUploadProvider
    {
        private object fileuploadPath;

        public MultiFileUploadProvider(object fileuploadPath)
        {
            this.fileuploadPath = fileuploadPath;
        }
    }
}