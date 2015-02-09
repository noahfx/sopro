#include "PresentationLayer.h"
#include "DataAccessLayer.h"
#include "ui_MainWindow.h"
MainWindow * pMainWindow;
bool societasQuit;
MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    pMainWindow=this;
    // get the web view
    QWebView * startup = ui->webView;
    QWebPage * poPage = startup->page();
    poPage->settings()->setAttribute(QWebSettings::DeveloperExtrasEnabled, true); //enable Inspect context menu
    // Load the startup screen
    startup->load(QUrl("https://banking.centralservices.io/demo/?marketid=BBTC_BUSD%7CCBTC_CCNY"));
    //startup->load(QUrl("http://localhost:38000"));
    splashScreen(true); //show the progress bar and splash screen while the app loads
}

void MainWindow::SL_Quitting()
{   // flag for all concurrent sub-processes
    qDebug() << "Sopro gui is quitting..";
    societasQuit=true;


}

void MainWindow::splashScreen(bool show)
{
   if (show) // show Splash Screen components only
   {
        ui->webView->hide();
        ui->Label_Progress_Bar->setText("Loading Societas..");
   // Handle startup page load progress
        connect(ui->webView, SIGNAL(loadProgress(int)), SLOT(setProgress(int)));
        connect(ui->webView, SIGNAL(loadFinished(bool)), SLOT(finishLoading(bool)));
   }
   else
   {
       // hide progress bar
        ui->progressBar->hide();
        ui->Label_Progress_Bar->hide();
     ui->webView->show();

   }
}

void MainWindow::refreshLoadProgress(int progress)
{
    //show progress bar
    ui->progressBar->show();
    if (progress >= 0 || progress < 100)
    {
    // update the progress bar
       ui->progressBar->setValue(progress);

    }


}

void MainWindow::setProgress(int p)
{
   refreshLoadProgress(p);
}
void MainWindow::finishLoading(bool)
 {
     refreshLoadProgress(100);
     splashScreen(false);

 }

MainWindow::~MainWindow()
{
    delete ui;
}

