#ifndef MAINWINDOW_H
#define MAINWINDOW_H
#include <ApplicationLayer.h>
#include <DataAccessLayer/xmppClient.h>

#include <QMainWindow>

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow // Implement the sopro Gui using a single webview + HTML5 apps
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();
public slots:
    void SL_Quitting();
protected slots:
    void setProgress(int p);
    void finishLoading(bool);

private:
    Ui::MainWindow *ui;
    void refreshLoadProgress(int progress);
    void splashScreen(bool show);
};
extern MainWindow * pMainWindow;
extern bool societasQuit;
#endif // MAINWINDOW_H
