# Updated by : Jay Modi
# Original credits: https://github.com/METIT-BU/xblock-carousel
# Added Translations for international course creators

import os
from setuptools import setup
from setuptools.command.install_lib import install_lib as _install_lib
from distutils.command.build import build as _build
from distutils.cmd import Command


class compile_translations(Command):
    description = 'compile message catalogs to MO files via django compilemessages'
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        import os
        from django.core.management import execute_from_command_line, CommandError

        curdir = os.getcwd()
        ceb_dir = os.path.realpath('carousel')
        os.chdir(ceb_dir)
        try:
            execute_from_command_line(['django-admin', 'compilemessages'])
        except CommandError:
            pass
        finally:
            os.chdir(curdir)

class build(_build):
    sub_commands = [('compile_translations', None)] + _build.sub_commands


class install_lib(_install_lib):
    def run(self):
        self.run_command('compile_translations')
        _install_lib.run(self)

def package_data(pkg, root_list):
    """Generic function to find package_data for `pkg` under `root`."""
    data = []
    for root in root_list:
        for dirname, _, files in os.walk(os.path.join(pkg, root)):
            for fname in files:
                data.append(os.path.relpath(os.path.join(dirname, fname), pkg))

    return {pkg: data}

def readme():
      with open('README.md') as f:
            return f.read()

setup(
    name='xblock-multimedia-carousel',
    version='0.1',
    description='XBlock - Multimedia-Carousel',
    long_description=readme(),
    packages=['carousel'],
    url='http://github.com/mjrulesamrat/lynxceb',
    author='Jay Modi',
    author_email='mjrulesamrat@gmail.com',
    license='MIT',
    install_requires=[
        'XBlock',
    ],
    entry_points={
        'xblock.v1': 'carousel = carousel:CarouselBlock',
    },
    package_data=package_data("carousel", ["templates", "public"]),
    include_package_data=True,
    cmdclass={'build': build, 'install_lib': install_lib,
        'compile_translations': compile_translations},
    zip_safe=False
)
