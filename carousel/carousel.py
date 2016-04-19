import textwrap
import urllib
from lxml import etree, html
from xml.etree import ElementTree as ET

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String
from xblock.fragment import Fragment

from .utils import load_resource, render_template

from StringIO import StringIO


class CarouselBlock(XBlock):
    """
    An XBlock providing a responsive images carousel
    """

    display_name = String(help="This name appears in horizontal navigation at the top of the page.",
        default="LYNX Slideshow",
        scope=Scope.content
    )

    data = String(help="",
       scope=Scope.content,
       default=textwrap.dedent("""
             <carousel>
              <image>
                <link>http://met-content.bu.edu/etr2/content/images/Slide1.JPG</link>
                <description>Slide 1 description comes here</description>
              </image>
              <image>
                <link>http://met-content.bu.edu/etr2/content/images/Slide2.JPG</link>
                <description>Slide 2 description comes here</description>
              </image>
              <image>
                <link>http://met-content.bu.edu/etr2/content/images/Slide3.JPG</link>
                <description>Slide 3 description comes here</description>
              </image>
              <video>
                <link>http://www.youtube.com/watch?v=7uHeNryKUWk</link>
                <description>Video Description goes here</description>
              </video>
              <document>
                <link>http://www.bu.edu/met-eti/files/2013/03/Final_VirtualLaboratoriesForLearning.pdf</link>
                <description>documentument Description goes here</description>
              </document>
            </carousel>
          """
    ))

    def student_view(self, context):
        """
        Lab view, displayed to the student
        """
        dummy_data=textwrap.dedent("""
                     <carousel>
                      <image>
                        <link>http://met-content.bu.edu/etr2/content/images/Slide1.JPG</link>
                        <description>Slide 1 description comes here</description>
                      </image>
                      <image>
                        <link>http://met-content.bu.edu/etr2/content/images/Slide2.JPG</link>
                        <description>Slide 2 description comes here</description>
                      </image>
                      <image>
                        <link>http://met-content.bu.edu/etr2/content/images/Slide3.JPG</link>
                        <description>Slide 3 description comes here</description>
                      </image>
                      <video>
                        <link>http://www.youtube.com/watch?v=7uHeNryKUWk</link>
                        <description>Video Description goes here</description>
                      </video>
                      <document>
                        <link>http://www.bu.edu/met-eti/files/2013/03/Final_VirtualLaboratoriesForLearning.pdf</link>
                        <description>documentument Description goes here</description>
                      </document>
                    </carousel>
                  """
            )

        #root = ET.fromstring(self.data)
        #root = etree.parse(StringIO(self.data.replace('&', '&amp;'))).getroot()
        root = etree.fromstring(self.data.replace('&', '&amp;'))
        items = []
        for child in root:
            text_data = child.find('link').text
            if child.tag == 'document': text_data = urllib.quote(text_data, '')
            description = child.find('description')
            description1 = ET.tostring(description)
            description1 = description1.replace('<description>', '')
            description1 = description1.replace('</description>', '')
            width = child.attrib.get('width', '100%')
            height = child.attrib.get('height', '625')
            items.append((child.tag, text_data, width, height, description1))

        fragment = Fragment()

        context = {
            'items': items,
        }

        fragment.add_content(render_template('/templates/html/carousel.html', context))
        fragment.add_javascript(load_resource('public/js/jquery-ui-1.10.4.custom.js'))
        fragment.add_css(load_resource('public/css/responsive-carousel.css'))
        fragment.add_css(load_resource('public/css/responsive-carousel.slide.css'))
        fragment.add_javascript(load_resource('public/js/responsive-carousel.js'))
        fragment.add_css_url("https://vjs.zencdn.net/4.5.1/video-js.css")
        fragment.add_javascript_url("https://vjs.zencdn.net/4.5.1/video.js")
        fragment.add_javascript(load_resource('public/js/youtube.js'))
        fragment.add_javascript('function CarouselBlock(runtime, element) { console.log("success..."); }')
        fragment.initialize_js('CarouselBlock')

        return fragment

    def studio_view(self, context):
        """
        Studio edit view
        """
        root = etree.fromstring(self.data.replace('&', '&amp;'))
        items = []
        for child in root:
            text_data = child.find('link').text
            if child.tag == 'document': text_data = urllib.quote(text_data, '')
            description = child.find('description')
            description1 = ET.tostring(description)
            description1 = description1.replace('<description>', '')
            description1 = description1.replace('</description>', '')
            width = child.attrib.get('width', '100%')
            height = child.attrib.get('height', '625')
            items.append((child.tag, text_data, width, height, description1))

        fragment = Fragment()

        context = {
            'data': self.data,
            'items': items,
            'display_name': self.display_name
        }

        fragment = Fragment()
        fragment.add_content(render_template('templates/html/carousel_edit.html', context))
        fragment.add_javascript(load_resource('public/js/jquery-ui-1.10.4.custom.js'))
        fragment.add_javascript(load_resource('public/js/tinymce.min.js'))
        fragment.add_javascript(load_resource('public/js/carousel_edit.js'))
        fragment.initialize_js('CarouselEditBlock')

        return fragment

    @XBlock.json_handler
    def studio_submit(self, submissions, suffix=''):
        self.display_name = submissions['display_name']
        xml_content = submissions['data']

        try:
            html.parse(StringIO(xml_content))
            self.data = xml_content
        except etree.XMLSyntaxError as e:
            return {
                'result': 'error',
                'message': e.message
            }

        return {
            'result': 'success',
        }

    @staticmethod
    def workbench_scenarios():
            return [("carousel demo", "<carousel />")]
