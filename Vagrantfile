# -*- mode: ruby -*-
# vi: set ft=ruby :
required_plugins = ["vagrant-hostmanager", "vagrant-berkshelf"]
required_plugins.each do |plugin|
  system "vagrant plugin install #{plugin}" unless Vagrant.has_plugin? plugin
end

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.define "web", primary: true do |web|
    web.vm.box = "ubuntu/trusty64"
    web.vm.network "private_network" , ip: "192.168.10.100"
    web.hostsupdater.aliases = ["development.local"]
    web.vm.synced_folder ".", "/home/ubuntu/app"

    web.vm.provision"chef_solo" do |webchef|
      # webchef.cookbooks_path= ['cookbooks']
      webchef.run_list =['recipe[node-server::default]']
    end
  end

  # hello okkk
  config.vm.define "db" do |db|
      db.vm.box = "ubuntu/trusty64"
      db.vm.hostname = 'db'
      db.vm.network "private_network" , ip: "192.10.10.150"
      # db.hostsupdater.aliases = ["database.local"]
      # ENV["MONGODB_URI"]="mongodb://192.168.10.101"
      db.vm.provision"chef_solo" do |dbchef|
        # dbchef.cookbooks_path= ['cookbooks']
        # dbchef.run_list =['recipe[node-server::mongo]']
      end
  end

#   config.vm.provision "chef_solo" do |chef|
#   chef.cookbooks_path = ['cookbooks']
#   chef.run_list =['recipe[node-server::default]']
# end
  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"


  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #


  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  # config.vm.provision "shell", inline: <<-SHELL
  #   apt-get update
  #   apt-get install -y apache2
  # SHELL
end
