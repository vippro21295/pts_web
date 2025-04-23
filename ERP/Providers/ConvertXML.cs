using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml;
using System.Xml.Serialization;

namespace ERP_MOTOBIKE.Providers
{
    public static class ConvertXML
    {
        public static string GetXMLString<T>(T objectToSerialize)
        {
            XmlSerializer xmlSerializer = new XmlSerializer(objectToSerialize.GetType());

            using (StringWriter stringWriter = new System.IO.StringWriter())
            {
                xmlSerializer.Serialize(stringWriter, objectToSerialize);
                return stringWriter.ToString();
            }
        }
        public static string ToXML<T>(this T obj)
        {
            // Remove Declaration
            var settings = new XmlWriterSettings
            {
                Indent = true,
                OmitXmlDeclaration = true
            };

            // Remove Namespace
            var ns = new XmlSerializerNamespaces(new[] { XmlQualifiedName.Empty });

            using (var stream = new StringWriter())
            using (var writer = XmlWriter.Create(stream, settings))
            {
                var serializer = new XmlSerializer(typeof(T));
                serializer.Serialize(writer, obj, ns);
                return stream.ToString();
            }
        }

    }
}