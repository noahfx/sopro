#-------------------------------------------------
#
# Main Project
# by Central Services
#
# Current version: 0.1.0
# Not Public Release
#-------------------------------------------------

VERSION = 0.1.0
QT       += core gui websockets
QMAKE_CXXFLAGS +=  -Wall -Wno-c++11-extensions

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets webkitwidgets

mac:{

LIBS += -L/usr/local/lib
#XMPP and Crypto dependencies
LIBS += -lresolv -lgloox  -lcrypto -lssl -lz -lidn
#MONGOOSE webserver dependencies
LIBS += -lmongoose
#ZEROMQ
LIBS += -lzmq
}
TARGET = societas
TEMPLATE = app

INCLUDEPATH +=../include \
              ../include/societas \
              ../include/util


include($${SOLUTION_DIR}../societas.pri)


