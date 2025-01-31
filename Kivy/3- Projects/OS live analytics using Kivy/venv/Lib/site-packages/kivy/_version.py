# This file is imported from __init__.py and exec'd from setup.py

MAJOR = 2
MINOR = 3
MICRO = 1
RELEASE = True

__version__ = '%d.%d.%d' % (MAJOR, MINOR, MICRO)

if not RELEASE:
    # if it's a rcx release, it's not proceeded by a period. If it is a
    # devx release, it must start with a period
    __version__ += ''


_kivy_git_hash = '20d74dcd30f143abbd1aa94c76bafc5bd934d5bd'
_kivy_build_date = '20241226'

