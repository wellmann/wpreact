# -*- mode: ruby -*-
# vi: set ft=ruby :
#
# Author:: Kevin Wellmann <kevin@wellmann.io>

Vagrant.configure(2) do |config|

  config.vm.provider "virtualbox" do |v|

    # https://askubuntu.com/questions/690855/mysql-5-6-dpkg-install-error-even-after-complete-uninstall/784121#784121
    v.memory = "1024"
  end

  config.vm.box = "ubuntu/trusty64"
  config.vm.network "private_network", ip: "192.168.12.44"

  config.vm.provision "shell", inline: <<-SHELL
    apt-add-repository ppa:ondrej/php &&
    apt-get update -y &&
    apt-get upgrade -y &&

    apt-get install php7.0-fpm -y &&
    apt-get install php7.0-mysql -y &&
    sudo sed -i 's|listen = /run/php/php7.0-fpm.sock|listen = 127.0.0.1:9000|g' /etc/php/7.0/fpm/pool.d/www.conf

    apt-get install mysql-server-5.6 -y &&
    mysql_secure_installation &&
    cp /etc/mysql/my.cnf /usr/share/mysql/my-default.cnf &&
    mysql_install_db

    curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash - &&
    apt-get install nodejs -y

    apt-get install g++ -y

    sudo ln -s /vagrant/server/mu-plugins /vagrant/server/wp/wp-content/mu-plugins
    sudo ln -s /vagrant/server/themes /vagrant/server/wp/wp-content/themes
  SHELL

  if Vagrant.has_plugin?("vagrant-triggers")
    config.trigger.after [:up, :reload], :stdout => true, :force => true do
      run_remote "iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080"
      run_remote "iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 3000"
      run_remote "cd /vagrant/server && npm run start:dev"
    end

    config.trigger.before [:suspend, :halt] do
      run_remote  "killall node"
    end
  else
    puts "PLUGIN VAGRANT-TRIGGERS MISSING! RUN:"
    puts
    puts "vagrant plugin install vagrant-triggers"
    exit
  end
end
